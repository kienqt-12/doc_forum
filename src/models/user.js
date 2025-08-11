import { GET_DB } from '~/config/mongodb';
import { ObjectId } from 'mongodb';

const USER_COLLECTION_NAME = 'users';

export const UserModel = {
  async createNew(data) {
    const newUser = {
      ...data,
      friends: [],
      friendRequestsSent: [],
      friendRequestsReceived: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(newUser);
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: result.insertedId });
  },

  async findByEmail(email) {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email });
  },

  async findById(id) {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
  },

  async pushToArray(userId, field, value) {
    return await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      {
        $addToSet: { [field]: new ObjectId(value) },
        $set: { updatedAt: new Date() }
      }
    );
  },

  async pullFromArray(userId, field, value) {
    return await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      {
        $pull: { [field]: new ObjectId(value) },
        $set: { updatedAt: new Date() }
      }
    );
  },

  async getUsersByIds(ids = []) {
    if (!Array.isArray(ids) || ids.length === 0) return [];
    const objectIds = ids.map(id => new ObjectId(id));
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find({ _id: { $in: objectIds } })
      .project({ name: 1, email: 1, avatar: 1 })
      .toArray();
  },

  async sendFriendRequest(currentUserId, targetUserId) {
    const [currentUser, targetUser] = await Promise.all([
      this.findById(currentUserId),
      this.findById(targetUserId)
    ]);

    if (!targetUser) throw new Error('Người dùng không tồn tại.');
    if (
      currentUser.friends?.includes(targetUserId) ||
      currentUser.friendRequestsSent?.includes(targetUserId)
    ) {
      throw new Error('Đã gửi yêu cầu hoặc đã là bạn bè.');
    }

    await Promise.all([
      this.pushToArray(currentUserId, 'friendRequestsSent', targetUserId),
      this.pushToArray(targetUserId, 'friendRequestsReceived', currentUserId)
    ]);
  },

  async acceptFriendRequest(currentUserId, requesterId) {
    const currentUser = await this.findById(currentUserId)
    if (!currentUser.friendRequestsReceived?.some(id => id.toString() === requesterId.toString())) {
      throw new Error('Không có yêu cầu từ người này.');
    }
    await Promise.all([
      this.pullFromArray(currentUserId, 'friendRequestsReceived', requesterId),
      this.pullFromArray(requesterId, 'friendRequestsSent', currentUserId),
      this.pushToArray(currentUserId, 'friends', requesterId),
      this.pushToArray(requesterId, 'friends', currentUserId)
    ])
  },

  async rejectFriendRequest(currentUserId, requesterId) {
    await Promise.all([
      this.pullFromArray(currentUserId, 'friendRequestsReceived', requesterId),
      this.pullFromArray(requesterId, 'friendRequestsSent', currentUserId)
    ]);
  },

  async cancelFriendRequest(currentUserId, targetUserId) {
    await Promise.all([
      this.pullFromArray(currentUserId, 'friendRequestsSent', targetUserId),
      this.pullFromArray(targetUserId, 'friendRequestsReceived', currentUserId)
    ]);
  },

  async unfriend(currentUserId, friendId) {
    await Promise.all([
      this.pullFromArray(currentUserId, 'friends', friendId),
      this.pullFromArray(friendId, 'friends', currentUserId)
    ]);
  },

  async getFriends(userId) {
    const user = await this.findById(userId);
    return await this.getUsersByIds(user.friends || []);
  },

  async getFriendRequests(userId) {
    const user = await this.findById(userId);
    const [received, sent] = await Promise.all([
      this.getUsersByIds(user.friendRequestsReceived || []),
      this.getUsersByIds(user.friendRequestsSent || [])
    ]);
    return { received, sent };
  }
};
