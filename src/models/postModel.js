// src/models/post.js
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const POST_COLLECTION_NAME = 'posts'

export const PostModel = {
  async createNew(data) {
    const newData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const result = await GET_DB().collection(POST_COLLECTION_NAME).insertOne(newData)
    return result
  },

  async getAll() {
    const result = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return result
  },

  async findByUserId(userId) {
    return await GET_DB().collection(POST_COLLECTION_NAME).find({ 'author._id': userId }).toArray()
  },

  async findById(postId) {
    const db = GET_DB()
    const result = await db.collection(POST_COLLECTION_NAME).findOne({ _id: new ObjectId(postId) })

    if (result?.comments) {
      result.comments = result.comments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((c) => ({
          ...c,
          _id: c._id.toString(),
          user: {
            _id: c.user._id.toString(),
            name: c.user.name,
            avatar: c.user.avatar
          },
          createdAt: c.createdAt
        }))
    }

    return result
  },

  async likePost(postId, userId) {
    const db = GET_DB()
    await db.collection(POST_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(postId) },
      { $addToSet: { likes: new ObjectId(userId) } }
    )
    return this.findById(postId)
  },

  async unlikePost(postId, userId) {
    const db = GET_DB()
    await db.collection(POST_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { likes: new ObjectId(userId) } }
    )
    return this.findById(postId)
  },

  async addComment(postId, commentData) {
    const db = GET_DB()

    const newComment = {
      _id: new ObjectId(),
      user: {
        _id: new ObjectId(commentData.user._id),
        name: commentData.user.name,
        avatar: commentData.user.avatar
      },
      content: commentData.content,
      imageUrl: commentData.imageUrl || '',
      createdAt: new Date()
    }

    const result = await db.collection(POST_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: newComment } }
    )

    if (result.modifiedCount === 0) {
      throw new Error('Không thể thêm bình luận, bài viết không tồn tại')
    }

    return {
      ...newComment,
      _id: newComment._id.toString(),
      user: {
        ...newComment.user,
        _id: newComment.user._id.toString()
      }
    }
  },

  async addReply(postId, commentId, replyData) {
    const db = GET_DB()

    const newReply = {
      _id: new ObjectId(),
      user: {
        _id: new ObjectId(replyData.user._id),
        name: replyData.user.name,
        avatar: replyData.user.avatar
      },
      content: replyData.content,
      createdAt: new Date()
    }

    const result = await db.collection(POST_COLLECTION_NAME).updateOne(
      {
        _id: new ObjectId(postId),
        'comments._id': new ObjectId(commentId)
      },
      {
        $push: {
          'comments.$.replies': newReply
        }
      }
    )

    if (result.modifiedCount === 0) {
      throw new Error('Không thể thêm trả lời, bình luận không tồn tại')
    }

    return {
      ...newReply,
      _id: newReply._id.toString(),
      user: {
        ...newReply.user,
        _id: newReply.user._id.toString()
      }
    }
  },

  async getTopPosts (limit = 5) {
    const db = GET_DB()
    return db.collection('posts').aggregate([
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ['$likes', []] } }
        }
      },
      { $sort: { likesCount: -1, createdAt: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          title: 1,
          author: '$author.name',
          avatar: '$author.avatar',
          likes: '$likesCount'
        }
      }
    ]).toArray()
  },

  async getTopDoctors(limit = 5) {
    const db = GET_DB()
    return db.collection('posts').aggregate([
      {
        $addFields: {
          normalizedDoctor: {
            $replaceAll: {
              input: {
                $replaceAll: {
                  input: { $toLower: '$doctor' },
                  find: ' ',
                  replacement: ''
                }
              },
              find: '.',
              replacement: ''
            }
          },
          normalizedWorkplace: {
            $replaceAll: {
              input: {
                $replaceAll: {
                  input: { $toLower: '$workplace' },
                  find: ' ',
                  replacement: ''
                }
              },
              find: '.',
              replacement: ''
            }
          },
          normalizedCity: {
            $replaceAll: {
              input: {
                $replaceAll: {
                  input: { $toLower: '$city' },
                  find: ' ',
                  replacement: ''
                }
              },
              find: '.',
              replacement: ''
            }
          }
        }
      },
      {
        $group: {
          _id: {
            doctor: '$normalizedDoctor',
            workplace: '$normalizedWorkplace',
            city: '$normalizedCity'
          },
          originalDoctor: { $first: '$doctor' },
          originalWorkplace: { $first: '$workplace' },
          originalCity: { $first: '$city' },
          avgRating: { $avg: { $toDouble: '$rating' } },
          totalPosts: { $sum: 1 }
        }
      },
      { $sort: { avgRating: -1, totalPosts: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          id: { $concat: ['$_id.doctor', '|', '$_id.workplace', '|', '$_id.city'] },
          name: '$originalDoctor',
          specialty: { $concat: ['$originalWorkplace', ' • ', '$originalCity'] },
          rating: { $round: ['$avgRating', 1] },
          totalPosts: 1
        }
      }
    ]).toArray()
  },
  async findByDoctor(doctor, workplace, city) {
    const db = GET_DB()
    const result = await db.collection(POST_COLLECTION_NAME)
      .find({
        'author.name': doctor,
        'author.workplace': workplace,
        'author.city': city
      })
      .project({
        _id: 1,
        title: 1,
        content: 1,
        likes: 1,
        createdAt: 1,
        'author.name': 1,
        'author.avatar': 1
      })
      .sort({ createdAt: -1 })
      .toArray()

    return result
  },

}
