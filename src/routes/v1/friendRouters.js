import express from 'express'
import { verifyFirebaseToken } from '~/middlewares/firebaseAuth'
import { friendController } from '~/controllers/friend'
import { notificationController } from '~/controllers/notificationController'
const Router = express.Router()

Router.post('/request/:id', verifyFirebaseToken, friendController.sendFriendRequest)
Router.post('/accept/:id', verifyFirebaseToken, notificationController.acceptFriendRequest)
Router.post('/reject/:id', verifyFirebaseToken, notificationController.rejectFriendRequest)
Router.post('/cancel/:id', verifyFirebaseToken, friendController.cancelFriendRequest)
Router.post('/unfriend/:id', verifyFirebaseToken, friendController.unfriend)
Router.get('/', verifyFirebaseToken, friendController.getMyFriends)
Router.get('/requests', verifyFirebaseToken, friendController.getMyFriendRequests)
Router.get('/:userId', verifyFirebaseToken, friendController.getFriendsByUserId)

export const friendRouter = Router
