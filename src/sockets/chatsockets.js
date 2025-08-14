// src/sockets/chatsockets.js
import { admin } from '~/config/firebaseAdmin.js';
import { GET_DB } from '~/config/mongodb.js';
import { UserModel } from '~/models/user.js';

export const initSockets = (io) => {
  // Xác thực token Firebase và lấy user từ DB
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No token provided'));

    try {
      const decoded = await admin.auth().verifyIdToken(token);

      const userInDb = await UserModel.findByEmail(decoded.email);
      if (!userInDb) return next(new Error('User not found in DB'));

      // Lưu thông tin user MongoDB vào socket
      socket.user = {
        _id: userInDb._id.toString(),
        name: userInDb.name,
        email: userInDb.email,
        avatar: userInDb.avatar
      };

      next();
    } catch (err) {
      console.error('❌ Firebase token verification failed:', err);
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.user.email);

    // Join room
    socket.on('joinRoom', ({ friendId }) => {
      if (!friendId) return;
      const roomName = [socket.user._id, friendId].sort().join('_');
      socket.join(roomName);
      console.log(`${socket.user.email} joined room ${roomName}`);
    });

    // Leave room
    socket.on('leaveRoom', ({ friendId }) => {
      if (!friendId) return;
      const roomName = [socket.user._id, friendId].sort().join('_');
      socket.leave(roomName);
      console.log(`${socket.user.email} left room ${roomName}`);
    });

    // Send message
    socket.on('sendMessage', async (msg) => {
      if (msg.senderId !== socket.user._id) {
        console.warn('SenderId không hợp lệ:', msg.senderId);
        return;
      }

      const db = GET_DB();
      const newMessage = {
        senderId: socket.user._id, // chắc chắn lấy _id MongoDB
        receiverId: msg.receiverId,
        text: msg.text,
        createdAt: new Date(),
        read: false,
      };

      try {
        const result = await db.collection('messages').insertOne(newMessage);

        const emitMsg = {
          ...newMessage,
          _id: result.insertedId.toString(),
        };

        const roomName = [socket.user._id, msg.receiverId].sort().join('_');
        io.to(roomName).emit('receiveMessage', emitMsg);
      } catch (err) {
        console.error('❌ Lỗi lưu message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('⚡ User disconnected:', socket.user.email);
    });
  });
};
