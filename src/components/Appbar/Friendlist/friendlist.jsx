import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Avatar, Stack, IconButton, Tooltip, Divider
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

function FriendList({ onChatClick }) {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Chưa đăng nhập');

        const res = await fetch(`http://localhost:8017/v1/friends`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Không thể tải danh sách bạn bè: ${errText}`);
        }

        const data = await res.json();
        console.log("📌 Friends API data:", data); // kiểm tra dữ liệu
        setFriends(data.friends || []);
      } catch (error) {
        console.error('❌ Lỗi tải bạn bè:', error);
      }
    };

    fetchFriends();
  }, []);

  return (
    <Box sx={{ width: 340, maxHeight: 420, bgcolor: '#fff', boxShadow: 4, borderRadius: 2, overflowY: 'auto', p: 2 }}>
      <Typography variant="h6" fontWeight={700} mb={1} sx={{ color: '#9C27B0' }}>
        👥 Danh sách bạn bè
      </Typography>

      <Divider sx={{ mb: 1 }} />

      <Stack spacing={1.5}>
        {friends.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Bạn chưa có bạn bè nào.
          </Typography>
        ) : (
          friends.map((friend) => (
            <Box
              key={friend._id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1,
                borderRadius: 2,
                transition: 'all 0.25s ease',
                '&:hover': { backgroundColor: '#F3E5F5' },
              }}
            >
              <Box sx={{ position: 'relative', mr: 1.5 }}>
                <Avatar src={friend.avatar} alt={friend.name} />
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Typography fontWeight={500}>{friend.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Ngoại tuyến
                </Typography>
              </Box>

              <Tooltip title="Nhắn tin">
                <IconButton
                  onClick={() => onChatClick && onChatClick(friend)}
                  sx={{ color: '#9C27B0', '&:hover': { color: '#7B1FA2' } }}
                >
                  <ChatIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ))
        )}
      </Stack>
    </Box>
  );
}

export default FriendList;
