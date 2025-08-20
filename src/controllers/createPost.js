import { UserModel } from '~/models/user'
import { PostModel } from '~/models/postModel'
import { NotificationModel } from '~/models/notification'
import { ObjectId } from 'mongodb'
import { DoctorModel } from '~/models/doctorModel'

export const postController = {
  async createPost(req, res) {
    try {
      const { _id, name, email, avatar } = req.user;

      const postData = {
        ...req.body,
        author: { _id, name, email, avatar }
      };

      // 1. Tạo bài viết mới
      const result = await PostModel.createNew(postData)
      const postId = result.insertedId

      if (req.body.doctor) {
        await DoctorModel.createOrUpdate({
          doctor: req.body.doctor,
          workplace: req.body.workplace,
          city: req.body.city,
          rating: req.body.rating,
          tags: req.body.tags
        })
      }
      // 2. Lấy danh sách bạn bè của người dùng
      const friends = await UserModel.getFriends(_id);

      // 3. Tạo thông báo cho từng bạn bè
      const notifications = friends.map(friend => ({
        userId: new ObjectId(friend._id),
        fromUserId: new ObjectId(_id),
        type: 'new_post',
        postId: postId,
        message: `${name} đã đăng bài viết mới.`,
        isRead: false,
        createdAt: new Date()
      }));

      await NotificationModel.createMany(notifications);

      // 4. Trả về kết quả tạo bài viết
      return res.status(201).json({ message: 'Tạo bài viết thành công', postId });
    } catch (error) {
      console.error('❌ Lỗi tạo bài viết:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  async getAllPosts(req, res) {
    try {
      const posts = await PostModel.getAll();
      return res.status(200).json(posts)
    } catch (error) {
      console.error('❌ Lỗi khi lấy bài viết:', error);
      return res.status(500).json({ error: error.message })
    }
  },
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id)

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      return res.status(200).json({ user })
    } catch (error) {
      console.error('❌ getUserById error:', error)
      return res.status(500).json({ error: error.message })
    }
  },
  async getPostsByUser(req, res) {
    try {
      const { userId } = req.params
      const posts = await PostModel.findByUserId(userId)

      return res.status(200).json({posts})
    } catch (error) {
      console.error('❌ Lỗi khi lấy bài viết theo user:', error)
      return res.status(500).json({ error: error.message })
    }
  },
  async likePost(req, res) {
    try {
      const { postId } = req.params
      const userId = req.user._id

      const post = await PostModel.findById(postId)
      if (!post) {
        return res.status(404).json({ message: 'Không tìm thấy bài viết' })
      }

      const hasLiked = post.likes?.some((id) => id.toString() === userId.toString())

      let updatedPost
      if (hasLiked) {
        updatedPost = await PostModel.unlikePost(postId, userId)
      } else {
        updatedPost = await PostModel.likePost(postId, userId)
      }

      return res.status(200).json({
        liked: !hasLiked,
        totalLikes: updatedPost.likes?.length || 0,
        message: hasLiked ? 'Đã bỏ like' : 'Đã like'
      })
    } catch (error) {
      console.error('❌ Lỗi khi like bài viết:', error)
      return res.status(500).json({ message: error.message })
    }
  },
  async addComment(req, res) {
    try {
      const { postId } = req.params
      const { content, imageUrl } = req.body
      const { _id, name, avatar } = req.user

      if (!content && !imageUrl) {
        return res.status(400).json({ message: 'Bình luận không được để trống' });
      }

      const commentData = {
        user: { _id, name, avatar },
        content: content || '',
        imageUrl: imageUrl || ''
      };

      const newComment = await PostModel.addComment(postId, commentData)

      return res.status(201).json({ comment: newComment })
    } catch (error) {
      console.error('❌ Lỗi khi thêm bình luận:', error)
      return res.status(500).json({ message: error.message })
    }
  },

  async replyComment(req, res) {
    try {
      const { postId, commentId } = req.params;
      const { content } = req.body;
      const { _id, name, avatar } = req.user;

      if (!content || !content.trim()) {
        return res.status(400).json({ message: 'Nội dung không được để trống' });
      }

      const replyData = {
        user: { _id, name, avatar },
        content
      };

      const newReply = await PostModel.addReply(postId, commentId, replyData);

      return res.status(201).json({ reply: newReply });
    } catch (error) {
      console.error('❌ Lỗi khi trả lời bình luận:', error);
      return res.status(500).json({ message: error.message });
    }
  },
  async getPostById(req, res) {
    try {
      const { postId } = req.params;
      const post = await PostModel.findById(postId);

      if (!post) {
        return res.status(404).json({ message: 'Không tìm thấy bài viết' });
      }

      return res.status(200).json(post);
    } catch (error) {
      console.error('❌ Lỗi khi lấy chi tiết bài viết:', error);
      return res.status(500).json({ message: error.message });
    }
  },
}
