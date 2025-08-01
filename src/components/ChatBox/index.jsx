import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

const ChatBox = ({ friend, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { sender: 'me', text: message }]);
    setMessage('');
  };

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 320,
        height: 420,
        zIndex: 2000,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#9C27B0',
          color: '#fff',
        }}
      >
        <Avatar src={friend.avatar} sx={{ mr: 1 }} />
        <Typography fontWeight={600} flexGrow={1}>
          {friend.name}
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Message list */}
      <Box
        sx={{
          flexGrow: 1,
          px: 1.5,
          py: 1,
          overflowY: 'auto',
          bgcolor: '#fdfdfd',
        }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Box
              sx={{
                maxWidth: '70%',
                px: 1.2,
                py: 0.8,
                bgcolor: msg.sender === 'me' ? '#E1BEE7' : '#F3E5F5',
                borderRadius: 2,
              }}
            >
              <Typography fontSize="0.9rem">{msg.text}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Input */}
      <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Nhập tin nhắn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <IconButton onClick={handleSend} color="primary">
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatBox;
