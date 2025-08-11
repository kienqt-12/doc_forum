import express from 'express';
import { verifyFirebaseToken } from '~/middlewares/firebaseAuth';
import { friendController } from '~/controllers/friend';

const Router = express.Router();

Router.post('/request/:id', verifyFirebaseToken, friendController.sendFriendRequest)
Router.post('/accept/:id', verifyFirebaseToken, friendController.acceptFriendRequest)
Router.post('/reject/:id', verifyFirebaseToken, friendController.rejectFriendRequest)
Router.post('/cancel/:id', verifyFirebaseToken, friendController.cancelFriendRequest)
Router.post('/unfriend/:id', verifyFirebaseToken, friendController.unfriend)
Router.get('/:userId', verifyFirebaseToken, friendController.getFriendsByUserId);
Router.get('/requests', verifyFirebaseToken, friendController.getMyFriendRequests)

export const friendRouter = Router;
