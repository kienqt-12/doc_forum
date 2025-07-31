import { PostModel } from '~/models/createPost';

export const postController = {
  async createNew(req, res) {
    try {
      // Lấy dữ liệu từ body
      const postData = req.body;

      // Lấy thông tin người dùng từ req.user nếu có
      const user = req.user || {};

      // Gắn thông tin người dùng vào bài viết
      const dataWithAuthor = {
        ...postData,
        author: {
          name: user.name || 'Ẩn danh',
          email: user.email || 'noemail@example.com',
          avatar: user.avatar || 'https://via.placeholder.com/48'
        },
        createdAt: new Date()
      };

      const createdPost = await PostModel.createNew(dataWithAuthor);
      res.status(201).json(createdPost);
    } catch (error) {
      console.error('❌ Lỗi khi tạo bài viết:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  },

  async getAll(req, res) {
    try {
      const posts = await PostModel.getAll();
      res.status(200).json(posts);
    } catch (error) {
      console.error('❌ Lỗi khi lấy danh sách bài viết:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
};
