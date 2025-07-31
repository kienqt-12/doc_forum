import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { loginRouter } from './loginRouters.js'
import { userRouter } from './userRouters.js'
import { postRouter } from './createPostRouters.js';

const router = express.Router()

router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'API is running'
  })
})

router.use('/login', loginRouter)
router.use('/users', userRouter) // <== Đảm bảo dòng này có

router.use('/posts', postRouter) // ✅ Dòng này CẦN PHẢI CÓ

export const APIs_v1 = router