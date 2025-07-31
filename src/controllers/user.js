import { UserModel } from '~/models/user'

export const userController = {
  async createOrFindUser(req, res) {
    try {
      const { name, email, avatar } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
      }

      // ✅ Chuẩn hoá email (thường là lowercase)
      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = await UserModel.findByEmail(normalizedEmail);
      if (existingUser) {
        return res.status(200).json({ user: existingUser });
      }

      const newUser = {
        name,
        email: normalizedEmail,
        avatar
      };

      const createdUser = await UserModel.createNew(newUser);
      return res.status(201).json({ user: createdUser });
    } catch (error) {
      console.error('❌ Lỗi tạo/tìm user:', error);
      return res.status(500).json({ error: error.message });
    }
  }
};
