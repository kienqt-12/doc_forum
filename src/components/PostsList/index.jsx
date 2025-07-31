import React, { useState } from 'react';import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Checkbox,
  Rating,
  Divider,
  Stack,
} from '@mui/material';
import { Favorite, FavoriteBorder, Share, Comment, Visibility } from '@mui/icons-material';
import useNavigation from '../../hooks/useNavigation';
import { useAuth } from '../../context/AuthContext';


const posts = [
  {
    id: 1,
    title: 'Chia sẻ kinh nghiệm khám tim mạch',
    hoursAgo: '2 giờ trước',
    comments: 25,
    views: 150,
    rating: 4.5,
    image: 'https://via.placeholder.com/48',
  },
  {
    id: 2,
    title: 'Hỏi về bệnh nhi khoa',
    hoursAgo: '5 giờ trước',
    comments: 12,
    views: 80,
    rating: 4.0,
    image: 'https://via.placeholder.com/48',
  },
  {
    id: 3,
    title: 'Cách chăm sóc da liễu',
    hoursAgo: '10 giờ trước',
    comments: 8,
    views: 60,
    rating: 3.5,
    image: 'https://via.placeholder.com/48',
  },
  {
    id: 3,
    title: 'Cách chăm sóc da liễu',
    hoursAgo: '10 giờ trước',
    comments: 8,
    views: 60,
    rating: 3.5,
    image: 'https://via.placeholder.com/48',
  },
  {
    id: 3,
    title: 'Cách chăm sóc da liễu',
    hoursAgo: '10 giờ trước',
    comments: 8,
    views: 60,
    rating: 3.5,
    image: 'https://via.placeholder.com/48',
  },
];

function PostList() {
  const handleCommentClick = (postId) => {
    console.log(`Mở bình luận cho bài post ${postId}`);
  };

  const handleCardClick = (id) => {
    if (!user) {
      setSnackbarOpen(true);
      // Optional: Tự chuyển hướng sau 1s
      setTimeout(() => goToLogin(), 1000);
      return;
    }
    goToPostDetail(id);
  };
  const {goToLogin} = useNavigation();
  const {goToPostDetail} = useNavigation();
  const { user } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 2, pt: 2 }}>
      {posts.map((post) => (
        <Card
          key={post.id}
          onClick={() => handleCardClick(post.id)}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            borderRadius: 3,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
            bgcolor: '#fff',
            transition: '0.3s',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          {/* Avatar */}
          <Box sx={{ p: 2 }}>
            <Avatar src={post.image} alt={post.title} sx={{ width: 56, height: 56 }} />
          </Box>

          {/* Content */}
          <CardContent sx={{ flex: 1, p: 2, pt: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
              }}
            >
              {/* Left: Title + Time */}
              <Box>
                <Typography variant="h6" sx={{ fontSize: '1rem', color: '#333', fontWeight: 600 }}>
                  {post.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'gray', fontStyle: 'italic' }}>
                  {post.hoursAgo}
                </Typography>
              </Box>

              {/* Right: Rating + Actions */}
              <Stack direction="row" spacing={1} alignItems="center">
                <Rating
                  value={post.rating}
                  readOnly
                  precision={0.5}
                  sx={{ fontSize: '1rem', color: '#FFD700' }}
                />
                <IconButton size="small" onClick={() => handleCommentClick(post.id)}>
                  <Comment sx={{ fontSize: 18, color: '#FE5E7E' }} />
                </IconButton>
                <Checkbox
                  icon={<FavoriteBorder sx={{ fontSize: 18, color: '#FE5E7E' }} />}
                  checkedIcon={<Favorite sx={{ fontSize: 18, color: '#BC3AAA' }} />}
                  sx={{ p: 0 }}
                />
                <IconButton size="small">
                  <Share sx={{ fontSize: 18, color: '#FE5E7E' }} />
                </IconButton>
              </Stack>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Bottom: Comments + Views */}
            <Box sx={{ display: 'flex', gap: 3, color: '#666' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Comment sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  {post.comments} bình luận
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Visibility sx={{ fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  {post.views} lượt xem
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default PostList;
