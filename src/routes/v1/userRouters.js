import express from 'express'
import { userController } from '../../controllers/user'
import { verifyFirebaseToken } from '~/middlewares/firebaseAuth'
import { decodeToken } from '~/middlewares/firebaseAuth'; // middleware kiểm tra token Firebase

const Router = express.Router()

Router.route('/')
  .post(verifyFirebaseToken, userController.createOrFindUser) // ✅ chỉ có POST
Router.route('/me').get(verifyFirebaseToken, userController.createOrFindUser); // auth: lấy user hiện tại
Router.route('/:id').get(userController.getUserById); // public: xem profile
// Router
//   .route('/users')
//   .post(verifyFirebaseToken, userController.createUser)

export const userRouter = Router
