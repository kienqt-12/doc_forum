// src/models/createPost.js
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb';

const POST_COLLECTION_NAME = 'posts'

export const PostModel = {
  async createNew(data) {
    const newData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
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
    return await GET_DB().collection(POST_COLLECTION_NAME).find({ 'author._id': userId }).toArray();
  },
  async findById(postId) {
    const db = GET_DB();
    const result = await db.collection('posts').findOne({ _id: new ObjectId(postId) });

    // ❗ Đảm bảo mỗi comment có user, content, createdAt (không null/undefined)
    if (result?.comments) {
      result.comments = result.comments.map((c) => ({
        ...c,
        _id: c._id.toString(),
        user: {
          _id: c.user._id.toString(),
          name: c.user.name,
          avatar: c.user.avatar
        },
        createdAt: c.createdAt
      }));
    }
    return result
  },

  async likePost(postId, userId) {
    const db = GET_DB()
    await db.collection('posts').updateOne(
      { _id: new ObjectId(postId) },
      { $addToSet: { likes: new ObjectId(userId) } }
    )
    return this.findById(postId)
  },

  async unlikePost(postId, userId) {
    const db = GET_DB()
    await db.collection('posts').updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { likes: new ObjectId(userId) } }
    )
    return this.findById(postId)
  },
  async addComment(postId, commentData) {
    const db = GET_DB();

    const newComment = {
      _id: new ObjectId(),
      user: {
        _id: new ObjectId(commentData.user._id),
        name: commentData.user.name,
        avatar: commentData.user.avatar
      },
      content: commentData.content,
      createdAt: new Date()
    };

    const result = await db.collection('posts').updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: newComment } }
    );

    // Nếu không cập nhật được (không có bài post), trả lỗi
    if (result.modifiedCount === 0) {
      throw new Error('Không thể thêm bình luận, bài viết không tồn tại');
    }

    // Trả về comment dạng JSON-friendly (chuyển ObjectId thành string)
    return {
      ...newComment,
      _id: newComment._id.toString(),
      user: {
        ...newComment.user,
        _id: newComment.user._id.toString()
      }
    };
  }
}
