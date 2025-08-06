import express from 'express'
import { postController } from '~/controllers/createPost'
import { verifyFirebaseToken } from '~/middlewares/firebaseAuth'


const router = express.Router()
router.post('/', verifyFirebaseToken, postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:postId', postController.getPostById); // ✅ thêm route này

router.get('/user/:userId', postController.getPostsByUser);
router.post('/:postId/like', verifyFirebaseToken, postController.likePost);
router.post('/:postId/comment', verifyFirebaseToken, postController.addComment);

export const postRouter = router