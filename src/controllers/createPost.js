import { UserModel } from '~/models/user';
import { PostModel } from '~/models/createPost';

export const postController = {
  async createPost(req, res) {
    try {
      const { name, email, avatar } = req.user;

      const postData = {
        ...req.body,
        author: { name, email, avatar }
      };

      const result = await PostModel.createNew(postData);
      return res.status(201).json(result);
    } catch (error) {
      console.error('❌ Lỗi tạo bài viết:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  async getAllPosts(req, res) {
    try {
      const posts = await PostModel.getAll(); // 👈 Hàm này bạn sẽ thêm ở model
      return res.status(200).json(posts);
    } catch (error) {
      console.error('❌ Lỗi khi lấy bài viết:', error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error('❌ getUserById error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}
