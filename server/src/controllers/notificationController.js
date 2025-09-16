import { NotificationModel } from '~/models/notification'
import { UserModel } from '~/models/user'
import { ObjectId } from 'mongodb'

export const notificationController = {
  // Lấy danh sách thông báo của user (có thể thêm paginate)
  async getNotifications(req, res) {
    try {
      const userId = req.user._id;
      const limit = parseInt(req.query.limit) || 20;
      const skip = parseInt(req.query.skip) || 0;

      const notifications = await NotificationModel.findByUserId(userId, { limit, skip });

      return res.status(200).json({ notifications });
    } catch (error) {
      console.error('❌ Lỗi lấy thông báo:', error);
      return res.status(500).json({ message: 'Lỗi máy chủ khi lấy thông báo.' });
    }
  },


  // Đánh dấu 1 thông báo đã đọc
  async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user._id;

      // Kiểm tra thông báo có thuộc user hay không (bảo mật)
      const notification = await NotificationModel.findByUserId(userId);
      const found = notification.find(n => n._id.toString() === notificationId);
      if (!found) {
        return res.status(404).json({ message: 'Thông báo không tồn tại hoặc không thuộc về bạn.' });
      }

      await NotificationModel.markAsRead(notificationId);

      return res.status(200).json({ message: 'Đã đánh dấu thông báo là đã đọc.' });
    } catch (error) {
      console.error('❌ Lỗi đánh dấu thông báo đã đọc:', error);
      return res.status(500).json({ message: 'Lỗi máy chủ khi đánh dấu thông báo.' });
    }
  },

  // (Tùy chọn) Đánh dấu nhiều thông báo đã đọc
  async markManyAsRead(req, res) {
    try {
      const userId = req.user._id;
      const { notificationIds } = req.body; // mảng id

      if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        return res.status(400).json({ message: 'Danh sách thông báo không hợp lệ.' });
      }

      // Tùy bạn kiểm tra các id thuộc user không, hoặc cho phép update luôn

      await NotificationModel.markManyAsRead(userId, notificationIds);

      return res.status(200).json({ message: 'Đã đánh dấu nhiều thông báo là đã đọc.' });
    } catch (error) {
      console.error('❌ Lỗi đánh dấu nhiều thông báo:', error);
      return res.status(500).json({ message: 'Lỗi máy chủ khi đánh dấu thông báo.' });
    }
  },
   async acceptFriendRequest(req, res) {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'Không xác thực được người dùng.' })
      }
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID bạn bè không hợp lệ.' })
      }
      const currentUserId = new ObjectId(req.user._id)
      const requesterId = new ObjectId(req.params.id)

      // Thực hiện chấp nhận kết bạn
      await UserModel.acceptFriendRequest(currentUserId, requesterId)

      // Tạo thông báo cho người gửi yêu cầu biết bạn đã chấp nhận
      const notification = {
        userId: requesterId,           // người nhận notification là người đã gửi lời mời
        fromUserId: currentUserId,    // người hiện tại (đã accept)
        type: 'friend_request_accepted',
        message: `${req.user.name} đã chấp nhận lời mời kết bạn của bạn.`,
        isRead: false,
        createdAt: new Date()
      }
      await NotificationModel.createMany([notification])

      return res.status(200).json({ message: 'Đã chấp nhận yêu cầu kết bạn.' })
    } catch (err) {
      console.error('❌ acceptFriendRequest:', err)
      return res.status(500).json({ message: err.message || 'Lỗi máy chủ.' })
    }
  },

  async rejectFriendRequest(req, res) {
    try {
      const currentUserId = new ObjectId(req.user._id)
      const requesterId = new ObjectId(req.params.id)

      await UserModel.rejectFriendRequest(currentUserId, requesterId)

      // Tạo thông báo cho người gửi yêu cầu biết bạn đã từ chối
      const notification = {
        userId: requesterId,
        fromUserId: currentUserId,
        type: 'friend_request_rejected',
        message: `${req.user.name} đã từ chối lời mời kết bạn của bạn.`,
        isRead: false,
        createdAt: new Date()
      }
      await NotificationModel.createMany([notification])

      return res.status(200).json({ message: 'Đã từ chối yêu cầu kết bạn.' })
    } catch (err) {
      console.error('❌ rejectFriendRequest:', err);
      return res.status(500).json({ message: 'Lỗi máy chủ.' })
    }
  }
}
