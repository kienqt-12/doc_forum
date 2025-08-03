import { UserModel } from '~/models/user';

export const userController = {
  async createOrFindUser(req, res) {
    try {
      const { name, email, avatar } = req.user; // req.user đã có sẵn từ Firebase middleware

      if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
      }

      let user = await UserModel.findByEmail(email);
      if (!user) {
        user = await UserModel.createNew({ name, email, avatar });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error('❌ createOrFindUser error:', error);
      return res.status(500).json({ message: 'Lỗi máy chủ. Không thể xử lý người dùng.' });
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
};
