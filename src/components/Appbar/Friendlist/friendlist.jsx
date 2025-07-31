import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const friends = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isOnline: true,
  },
  {
    id: 2,
    name: 'Trần Thị B',
    avatar: 'https://i.pravatar.cc/150?img=2',
    isOnline: false,
  },
  {
    id: 3,
    name: 'Lê Văn C',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isOnline: true,
  },
  {
    id: 4,
    name: 'Phạm Hồng D',
    avatar: 'https://i.pravatar.cc/150?img=4',
    isOnline: false,
  },
];

function FriendList() {
  return (
    <Box
      sx={{
        width: 340,
        maxHeight: 420,
        bgcolor: '#fff',
        boxShadow: 4,
        borderRadius: 2,
        overflowY: 'auto',
        p: 2,
        '&::-webkit-scrollbar': {
          width: 6,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#ccc',
          borderRadius: 3,
        },
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        mb={1}
        sx={{ color: '#9C27B0' }} // màu chủ đạo
      >
        👥 Danh sách bạn bè
      </Typography>
      <Divider sx={{ mb: 1 }} />

      <Stack spacing={1.5}>
        {friends.map((friend) => (
          <Box
            key={friend.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1,
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#F3E5F5', // tím nhạt
              },
            }}
          >
            <Box sx={{ position: 'relative', mr: 1.5 }}>
              <Avatar src={friend.avatar} alt={friend.name} />
              {friend.isOnline && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 10,
                    height: 10,
                    bgcolor: '#4CAF50', // màu xanh online
                    border: '2px solid #fff',
                    borderRadius: '50%',
                  }}
                />
              )}
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography fontWeight={500}>{friend.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {friend.isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}
              </Typography>
            </Box>

            <Tooltip title="Nhắn tin">
              <IconButton
                sx={{
                  color: '#9C27B0', // màu chủ đạo
                  '&:hover': {
                    color: '#7B1FA2',
                  },
                }}
              >
                <ChatIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default FriendList;
