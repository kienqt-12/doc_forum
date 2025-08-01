import express from 'express'
import { userController } from '../../controllers/user'
import { verifyFirebaseToken } from '~/middlewares/firebaseAuth'

const Router = express.Router()

Router.route('/')
  .post(verifyFirebaseToken, userController.createOrFindUser) // ✅ chỉ có POST

export const userRouter = Router
