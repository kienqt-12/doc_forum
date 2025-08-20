import express from 'express'
import { GET_DB } from '~/config/mongodb.js'
import { verifyFirebaseToken } from '~/middlewares/firebaseAuth'

const router = express.Router()

// GET /v1/messages/:friendId - lấy lịch sử chat
router.get('/:friendId', verifyFirebaseToken, async (req, res) => {
  try {
    const db = GET_DB();
    const { friendId } = req.params;
    const userId = req.user._id;

    const messages = await db.collection('messages')
      .find({
        $or: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId }
        ]
      })
      .sort({ createdAt: 1 })
      .toArray();

    // Convert ObjectId sang string để frontend so sánh dễ dàng
    const result = messages.map(msg => ({
      ...msg,
      _id: msg._id.toString(),
      senderId: msg.senderId.toString(),
      receiverId: msg.receiverId.toString(),
    }));

    res.json({ messages: result });
  } catch (err) {
    console.error('❌ Lỗi tải lịch sử:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /v1/messages - lưu tin nhắn mới
router.post('/', verifyFirebaseToken, async (req, res) => {
  try {
    const db = GET_DB();
    const senderId = req.user._id;
    const { receiverId, text, imageUrl } = req.body;

    if (!receiverId || (!text && !imageUrl))
      return res.status(400).json({ message: 'Thiếu dữ liệu' });

    const newMessage = {
      senderId,
      receiverId,
      text: text || '',
      imageUrl: imageUrl || '',  // thêm imageUrl
      createdAt: new Date(),
      read: false
    };

    const result = await db.collection('messages').insertOne(newMessage);
    newMessage._id = result.insertedId.toString();

    res.status(201).json({ message: 'Đã lưu tin nhắn', data: newMessage });
  } catch (err) {
    console.error('❌ Lỗi lưu tin nhắn:', err);
    res.status(500).json({ message: 'Server error' });
  }
})


export const messagesRoute = router
