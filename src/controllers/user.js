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
      return res.status(500).json({ error: error.message });
    }
  }
};
