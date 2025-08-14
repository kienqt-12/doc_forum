import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';

const NOTIFICATION_COLLECTION = 'notifications';

export const NotificationModel = {
  async createMany(notifications) {
    if (!notifications.length) return;
    const db = GET_DB();
    return await db.collection(NOTIFICATION_COLLECTION).insertMany(notifications);
  },

  async findByUserId(userId, options = {}) {
    const db = GET_DB();
    const { limit = 20, skip = 0 } = options;

    return await db.collection(NOTIFICATION_COLLECTION)
      .aggregate([
        { $match: { userId: new ObjectId(userId) } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'fromUserId',
            foreignField: '_id',
            as: 'fromUserInfo'
          }
        },
        { $unwind: { path: '$fromUserInfo', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            userId: 1,
            type: 1,
            postId: 1,
            message: 1,
            isRead: 1,
            createdAt: 1,
            'fromUserInfo.name': 1,
            'fromUserInfo.avatar': 1,
            'fromUserInfo.email': 1
          }
        }
      ])
      .toArray();
  },


  async findOneByIdAndUser(notificationId, userId) {
    const db = GET_DB();
    return await db.collection(NOTIFICATION_COLLECTION).findOne({
      _id: new ObjectId(notificationId),
      userId: new ObjectId(userId)
    });
  },

  async markAsRead(notificationId) {
    const db = GET_DB();
    return await db.collection(NOTIFICATION_COLLECTION).updateOne(
      { _id: new ObjectId(notificationId) },
      { $set: { isRead: true } }
    );
  },

  async markManyAsRead(userId, notificationIds) {
    const db = GET_DB();
    const objectIds = notificationIds
      .filter(id => ObjectId.isValid(id))
      .map(id => new ObjectId(id));

    return await db.collection(NOTIFICATION_COLLECTION).updateMany(
      { _id: { $in: objectIds }, userId: new ObjectId(userId) },
      { $set: { isRead: true } }
    );
  }
};
