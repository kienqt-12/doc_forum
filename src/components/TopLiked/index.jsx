// components/TopLikedPosts.jsx
import React from 'react';
import { Box, Typography, Avatar, Stack, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const topPosts = [
  {
    id: 1,
    author: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/100?img=1',
    title: 'Lập trình là đam mê không chỉ là công việc!',
    likes: 1200
  },
  {
    id: 2,
    author: 'Trần Thị B',
    avatar: 'https://i.pravatar.cc/100?img=2',
    title: 'Tips học React hiệu quả cho người mới bắt đầu',
    likes: 950
  },
  {
    id: 3,
    author: 'Lê Văn C',
    avatar: 'https://i.pravatar.cc/100?img=3',
    title: 'Tổng hợp tài liệu học Frontend miễn phí',
    likes: 830
  },
  {
    id: 3,
    author: 'Lê Văn C',
    avatar: 'https://i.pravatar.cc/100?img=3',
    title: 'Tổng hợp tài liệu học Frontend miễn phí',
    likes: 830
  },
  {
    id: 3,
    author: 'Lê Văn C',
    avatar: 'https://i.pravatar.cc/100?img=3',
    title: 'Tổng hợp tài liệu học Frontend miễn phí',
    likes: 830
  }
];

const TopLikedPosts = () => {
  return (
    <Box sx={{ 
      bgcolor: '#fff', 
      borderRadius: 2, 
      p: 3, 
      mt: 4,
      flexGrow: 1,
              overflowY: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
      }}>
      <Typography variant="h6" fontWeight={700} mb={2} color="#FE5E7E">
        🔥 Bài viết được yêu thích nhất
      </Typography>

      <Stack spacing={2}>
        {topPosts.map((post) => (
          <Stack
            key={post.id}
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              p: 2,
              bgcolor: '#FFF0F2',
              borderRadius: 2,
              '&:hover': { bgcolor: '#FFE6EB' },
              transition: 'all 0.2s ease'
            }}
          >
            <Avatar src={post.avatar} alt={post.author} />
            <Box flex={1}>
              <Typography fontWeight={600}>{post.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                {post.author}
              </Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <FavoriteIcon sx={{ color: '#FE5E7E', fontSize: 18 }} />
              <Typography variant="body2" fontWeight={500}>
                {post.likes}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default TopLikedPosts;
