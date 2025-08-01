import admin from '../config/firebaseAdmin';

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decodedToken = await admin.auth().verifyIdToken(token);
    // Gán decodedToken vào req.user
    req.user = {
      uid: decodedToken.uid,
      name: decodedToken.name,
      email: decodedToken.email,
      avatar: decodedToken.picture,
    };

    next();
  } catch (error) {
    console.error('❌ Firebase token verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
