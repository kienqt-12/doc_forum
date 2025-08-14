// src/components/ChatBox.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Avatar, TextField, IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import io from 'socket.io-client';
import { format } from 'date-fns';
import { useAuth } from '~/context/AuthContext';

const SOCKET_URL = 'http://localhost:8017';

function ChatBox({ friend, onClose }) {
  const { user } = useAuth();
  const currentUserId = user?._id; 
  const currentUserAvatar = user?.avatar;
  const token = localStorage.getItem('accessToken');

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef();
  const messagesEndRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  // Kết nối Socket
  useEffect(() => {
    if (!currentUserId || !token || !friend?._id) return;

    socketRef.current = io(SOCKET_URL, { auth: { token } });

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to socket server');
      socketRef.current.emit('joinRoom', { friendId: friend._id });
    });

    // Chỉ nhận message từ người khác
    socketRef.current.on('receiveMessage', (msg) => {
      if (msg.senderId !== currentUserId) {
        setMessages(prev => [
          ...prev,
          { ...msg, senderId: String(msg.senderId), receiverId: String(msg.receiverId) }
        ]);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leaveRoom', { friendId: friend._id });
        socketRef.current.disconnect();
      }
    };
  }, [friend, currentUserId, token]);

  // Fetch lịch sử chat
  useEffect(() => {
    if (!friend?._id || !token) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:8017/v1/messages/${friend._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Không thể tải tin nhắn');
        const data = await res.json();

        const formattedMessages = (data.messages || []).map(msg => ({
          ...msg,
          senderId: String(msg.senderId),
          receiverId: String(msg.receiverId),
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error('❌ Lỗi fetch messages:', err);
      }
    };

    fetchMessages();
  }, [friend, token]);

  // Gửi tin nhắn (POST API + broadcast socket)
  const handleSend = async () => {
  if (!text.trim()) return;

  const msgPayload = {
    receiverId: friend._id,
    text
  };

  try {
    // 1️⃣ Gọi API lưu tin nhắn
    const res = await fetch('http://localhost:8017/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(msgPayload)
    });

    if (!res.ok) throw new Error('Lưu tin nhắn thất bại');
    const data = await res.json();

    // 2️⃣ Thêm tin nhắn vào local state
    const formattedMsg = {
      ...data.data,
      senderId: String(data.data.senderId),
      receiverId: String(data.data.receiverId)
    };
    setMessages(prev => [...prev, formattedMsg]);

    // 3️⃣ Emit socket chỉ sau khi lưu thành công
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('sendMessage', formattedMsg);
    }

    setText('');
  } catch (err) {
    console.error(err);
  }
};


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 400,
        maxHeight: 600,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#9C27B0', color: '#fff', p: 1, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={friend.avatar} sx={{ mr: 1 }} />
          <Typography fontWeight={700}>{friend.name}</Typography>
        </Box>
        <Box component="span" onClick={onClose} sx={{ cursor: 'pointer', fontWeight: 700 }}>✖</Box>
      </Box>

      {/* Messages */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: '#F3E5F5' }}>
        {messages.map((msg, idx) => {
          const isMine = msg.senderId === currentUserId;

          return (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                justifyContent: isMine ? 'flex-end' : 'flex-start',
                mb: 1,
                alignItems: 'flex-end'
              }}
            >
              {!isMine && <Avatar src={friend.avatar} sx={{ width: 24, height: 24, mr: 1 }} />}
              {isMine && <Avatar src={currentUserAvatar} sx={{ width: 24, height: 24, ml: 1 }} />}
              <Box sx={{ bgcolor: isMine ? '#9C27B0' : '#E1BEE7', color: isMine ? '#fff' : '#000', p: 1.2, borderRadius: 2, maxWidth: '75%', wordBreak: 'break-word' }}>
                <Typography variant="body2">{msg.text}</Typography>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                  {format(new Date(msg.createdAt), 'HH:mm')}
                </Typography>
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ display: 'flex', p: 1, bgcolor: '#fff' }}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default ChatBox;
