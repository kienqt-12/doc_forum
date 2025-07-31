import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Checkbox,
  Rating,
  Divider,
  Stack
} from '@mui/material';
import { Favorite, FavoriteBorder, Share, Comment, Visibility } from '@mui/icons-material';
import useNavigation from '../../hooks/useNavigation';
import { useAuth } from '../../context/AuthContext';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { goToLogin, goToPostDetail } = useNavigation();
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:8017/v1/posts');
      if (!res.ok) throw new Error('Lỗi lấy bài viết');
      const data = await res.json();

      // Sắp xếp theo thời gian mới nhất
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const enhanced = sorted.map((post) => {
        let avatarFallback = 'https://via.placeholder.com/48';
        let image = post?.author?.avatar || avatarFallback;

        if (
          post?.author?.email &&
          user?.email &&
          post.author.email === user.email &&
          user?.avatar
        ) {
          image = user.avatar;
        }

        return {
          ...post,
          id: post._id,
          hoursAgo: '1 giờ trước',
          comments: post.comments || 0,
          views: post.views || 0,
          rating: post.rating || 4,
          image
        };
      });

      setPosts(enhanced);
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
    }
  };

  useEffect(() => {
    fetchPosts();

    const handleNewPost = () => fetchPosts();
    window.addEventListener('postCreated', handleNewPost);
    return () => window.removeEventListener('postCreated', handleNewPost);
  }, [user]);

  const handleCommentClick = (postId) => {
    console.log(`Mở bình luận cho bài post ${postId}`);
  };

  const handleCardClick = (id) => {
    if (!user) {
      setSnackbarOpen(true);
      setTimeout(() => goToLogin(), 1000);
      return;
    }
    goToPostDetail(id);
  };

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
              transform: 'translateY(-2px)'
            }
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
                flexWrap: 'wrap'
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontSize: '1rem', color: '#333', fontWeight: 600 }}>
                  {post.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'gray', fontStyle: 'italic' }}>
                  {post.hoursAgo}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <Rating value={post.rating} readOnly precision={0.5} sx={{ fontSize: '1rem', color: '#FFD700' }} />
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleCommentClick(post.id); }}>
                  <Comment sx={{ fontSize: 18, color: '#FE5E7E' }} />
                </IconButton>
                <Checkbox
                  icon={<FavoriteBorder sx={{ fontSize: 18, color: '#FE5E7E' }} />}
                  checkedIcon={<Favorite sx={{ fontSize: 18, color: '#BC3AAA' }} />}
                  sx={{ p: 0 }}
                />
                <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                  <Share sx={{ fontSize: 18, color: '#FE5E7E' }} />
                </IconButton>
              </Stack>
            </Box>

            <Divider sx={{ my: 1 }} />

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
