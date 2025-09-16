import express from 'express'
import { postController } from '~/controllers/createPost'
import { verifyFirebaseToken } from '~/middlewares/firebaseAuth'


const router = express.Router()
router.post('/', verifyFirebaseToken, postController.createPost)
router.get('/', postController.getAllPosts)
router.get('/:postId', postController.getPostById)
router.delete('/:postId', verifyFirebaseToken, postController.deletePost)

router.get('/user/:userId', postController.getPostsByUser)
router.post('/:postId/like', verifyFirebaseToken, postController.likePost)
router.post('/:postId/comment', verifyFirebaseToken, postController.addComment)
router.post('/:postId/comments/:commentId/reply', verifyFirebaseToken, postController.replyComment)

export const postRouter = router