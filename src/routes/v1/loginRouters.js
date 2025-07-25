import express from 'express'
import { StatusCodes } from 'http-status-codes'
const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({
      message: 'API get List Login'
    })
  })
  .post((req, res) => {
    // Here you would handle the login logic, e.g., checking credentials
    res.status(StatusCodes.CREATED).json({
      message: 'API create Login',
    })
  })
  
export const loginRouter = Router