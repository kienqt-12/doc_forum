import express from 'express'
import { userController } from '../../controllers/user'
import { verifyFirebaseToken } from '~/middlewares/firebaseAuth'

const Router = express.Router()

Router.route('/')
  .post(verifyFirebaseToken, userController.createOrFindUser)
Router.route('/me').get(verifyFirebaseToken, userController.createOrFindUser)
Router.route('/:id').get( verifyFirebaseToken, userController.getUserById)

export const userRouter = Router
