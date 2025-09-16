import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { loginRouter } from './loginRouters.js'
import { userRouter } from './userRouters.js'
import { postRouter } from './createPostRouters.js'
import { friendRouter } from './friendRouters.js'
import { notiRouter } from './notificationRouters.js'
import { topRankRouter } from './topRankRouters.js'
import { messagesRoute } from './messageRouters.js'
import { doctorRoutes } from './doctorRouters.js'
const router = express.Router()

router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'API is running'
  })
})

router.use('/login', loginRouter)
router.use('/users', userRouter)
router.use('/posts', postRouter)
router.use('/friends', friendRouter)
router.use('/notifications', notiRouter)
router.use('/ranking', topRankRouter )
router.use('/messages', messagesRoute)
router.use('/doctors', doctorRoutes)

export const APIs_v1 = router