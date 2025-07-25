import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { loginRouter } from './loginRouters.js'

const router = express.Router()

router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'API is running'
  })
})

router.use('/login', loginRouter)

export const APIs_v1 = router