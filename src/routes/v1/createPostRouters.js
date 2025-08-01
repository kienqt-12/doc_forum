import express from 'express'
import { postController } from '~/controllers/createPost'
import { verifyFirebaseToken } from '~/middlewares/firebaseAuth'


const router = express.Router()
router
  .route('/')
  .post( verifyFirebaseToken, postController.createPost);

// Lấy tất cả bài viết
  router.route('/').
  get(postController.getAllPosts); // 👈 THÊM DÒNG NÀY
export const postRouter = router