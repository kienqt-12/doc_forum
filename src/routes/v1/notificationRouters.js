import express from 'express'
import { notificationController } from '~/controllers/notificationController'
import { verifyFirebaseToken } from '~/middlewares/firebaseAuth'

const router = express.Router()

// Các API lấy thông báo, đánh dấu đã đọc cần xác thực user
router.use(verifyFirebaseToken)

// Lấy danh sách thông báo (có paginate)
router.get('/', notificationController.getNotifications)

// Đánh dấu 1 thông báo đã đọc
router.patch('/:notificationId/read', notificationController.markAsRead)

// Đánh dấu nhiều thông báo đã đọc
router.patch('/read-many', notificationController.markManyAsRead)


export const notiRouter = router
