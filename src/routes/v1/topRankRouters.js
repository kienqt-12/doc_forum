// src/routes/v1/topRank.js
import express from 'express'
import { topRankController } from '~/controllers/ranking'

const Router = express.Router()

Router.get('/', topRankController.getTopRank)

export const topRankRouter = Router
