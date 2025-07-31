import express from 'express'
import { postController } from '~/controllers/createPost'

const Router = express.Router()

Router.post('/', postController.createNew)
Router.get('/', postController.getAll)

export const postRouter = Router
