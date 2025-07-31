import express from 'express'
import { userController } from '../../controllers/user'

const Router = express.Router()

Router.route('/')
  .post(userController.createOrFindUser) // ✅ chỉ có POST

export const userRouter = Router
