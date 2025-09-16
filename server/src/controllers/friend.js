import { UserModel } from '~/models/user'
import { ObjectId } from 'mongodb'

export const friendController = {
  async sendFriendRequest(req, res) {
    try {
      const currentUserId = new ObjectId(req.user._id)
      const targetUserId = new ObjectId(req.params.id)
      if (currentUserId.equals(targetUserId)) {
        return res.status(400).json({ message: 'Không thể kết bạn với chính mình.' })
      }
      await UserModel.sendFriendRequest(currentUserId, targetUserId)
      return res.status(200).json({ message: 'Đã gửi yêu cầu kết bạn.' })
    } catch (err) {
      console.error('❌ sendFriendRequest:', err)
      return res.status(500).json({ message: 'Lỗi máy chủ.' })
    }
  },

  async cancelFriendRequest(req, res) {
    try {
      const currentUserId = new ObjectId(req.user._id)
      const targetUserId = new ObjectId(req.params.id)

      await UserModel.cancelFriendRequest(currentUserId, targetUserId)
      return res.status(200).json({ message: 'Đã hủy yêu cầu kết bạn.' })
    } catch (err) {
      console.error('❌ cancelFriendRequest:', err);
      return res.status(500).json({ message: 'Lỗi máy chủ.' })
    }
  },

  async unfriend(req, res) {
    try {
      const currentUserId = new ObjectId(req.user._id)
      const friendId = new ObjectId(req.params.id)

      await UserModel.unfriend(currentUserId, friendId);
      return res.status(200).json({ message: 'Đã hủy kết bạn.' });
    } catch (err) {
      console.error('❌ unfriend:', err);
      return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
  },

  async getMyFriends(req, res) {
    try {
      console.log('>>> currentUserId:', req.user._id);
      const friends = await UserModel.getFriends(req.user._id)
      console.log('>>> friends from DB:', friends)
      return res.status(200).json({ friends })
    } catch (err) {
      console.error('❌ getMyFriends:', err)
      return res.status(500).json({ message: 'Lỗi máy chủ.' })
    }
  },

  async getMyFriendRequests(req, res) {
    try {
      const currentUserId = new ObjectId(req.user._id);
      const result = await UserModel.getFriendRequests(currentUserId)
      return res.status(200).json(result); // { received, sent }
    } catch (err) {
      console.error('❌ getMyFriendRequests:', err);
      return res.status(500).json({ message: 'Lỗi máy chủ.' })
    }
  },
  async getFriendsByUserId(req, res) {
    try {
      const { userId } = req.params;
      console.log('>>> userId lấy bạn bè:', userId);

      // Kiểm tra userId có hợp lệ không
      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'ID người dùng không hợp lệ.' });
      }

      const friends = await UserModel.getFriends(userId);

      return res.status(200).json({ friends });
    } catch (err) {
      console.error('❌ getFriendsByUserId:', err);
      return res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
  }

}