import { ObjectId } from 'mongodb';
import { UserModel } from '~/models/user';

export const userController = {
  async createOrFindUser(req, res) {
    try {
      const { name, email, avatar } = req.user;

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
      const currentUserId = req.user ? req.user._id.toString() : null;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID.' });
      }

      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      let isFriend = false;
      let isRequestSent = false;
      let isRequestReceived = false;

      if (currentUserId && currentUserId !== id) {
        const currentUser = await UserModel.findById(currentUserId);

        isFriend = currentUser.friends?.some(
          fid => fid.toString() === id
        );
        isRequestSent = currentUser.friendRequestsSent?.some(
          rid => rid.toString() === id
        );
        isRequestReceived = currentUser.friendRequestsReceived?.some(
          rid => rid.toString() === id
        );
      }

      return res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
          isFriend,
          isRequestSent,
          isRequestReceived
        }
      });
    } catch (error) {
      console.error('❌ getUserById error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

}
