import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { UserModel } from '~/models/user.js'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({
      message: 'API get List Login'
    })
  })

  .post(async (req, res) => {
    try {
      const { name, email, avatar } = req.body

      if (!email) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Thiếu email' })
      }

      let user = await UserModel.findByEmail(email)

      if (!user) {
        const result = await UserModel.createNew({ name, email, avatar })
        user = await UserModel.findById(result.insertedId)
      }

      return res.status(StatusCodes.OK).json({ user })
    } catch (error) {
      console.error('Login error:', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Lỗi server khi login' })
    }
  })

export const loginRouter = Router
