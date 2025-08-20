// src/sockets/chatsockets.js
import { admin } from '~/config/firebaseAdmin.js';
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

    // Join room
    socket.on('joinRoom', ({ friendId }) => {
      if (!friendId) return;
      const roomName = [socket.user._id, friendId].sort().join('_')
      socket.join(roomName);
    })

    // Leave room
    socket.on('leaveRoom', ({ friendId }) => {
      if (!friendId) return;
      const roomName = [socket.user._id, friendId].sort().join('_')
      socket.leave(roomName);
    })

    // Chỉ broadcast message tới room, không insert DB
    socket.on('sendMessage', (msg) => {
      const roomName = [socket.user._id, msg.receiverId].sort().join('_');
      io.to(roomName).emit('receiveMessage', msg);
    })

    socket.on('disconnect', () => {
    })
  })
}
