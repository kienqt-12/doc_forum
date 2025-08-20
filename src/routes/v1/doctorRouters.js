import express from 'express'
import { doctorController } from '~/controllers/doctor'

const Router = express.Router()

Router.get('/ranking', doctorController.getRanking)
Router.get('/filter', doctorController.getByFilter)
Router.get('/posts', doctorController.getPosts)
Router.get('/:name', doctorController.findByName)


export const doctorRoutes = Router
