import { admin } from '../config/firebaseAdmin'
import { UserModel } from '~/models/user'

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'No token provided' })

    const decodedToken = await admin.auth().verifyIdToken(token)

    const userInDb = await UserModel.findByEmail(decodedToken.email)
    if (!userInDb) {
      return res.status(404).json({ message: 'User not found in system' })
    }

    req.user = {
      _id: userInDb._id.toString(),
      name: userInDb.name,
      email: userInDb.email,
      avatar: userInDb.avatar
    }

    next();
  } catch (error) {
    console.error('❌ Firebase token verification failed:', error)
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
