import express from 'express'
import { postController } from '~/controllers/createPost'
import { verifyFirebaseToken } from '~/middlewares/firebaseAuth'


const router = express.Router()
router
  .route('/')
  .post( verifyFirebaseToken, postController.createPost)
router
  .route('/user/:userId')
  .get(postController.getPostsByUser)
  router.route('/').
  get(postController.getAllPosts)
export const postRouter = router