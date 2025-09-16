import { admin } from '../config/firebaseAdmin'
import { UserModel } from '~/models/user'

export const verifySocketToken = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No token provided'));

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userInDb = await UserModel.findByEmail(decodedToken.email);
    if (!userInDb) return next(new Error('User not found'));

    socket.user = {
      _id: userInDb._id.toString(),
      name: userInDb.name,
      email: userInDb.email,
      avatar: userInDb.avatar
    };

    next();
  } catch (err) {
    console.error('❌ Firebase socket auth failed:', err);
    next(new Error('Invalid or expired token'));
  }
};
