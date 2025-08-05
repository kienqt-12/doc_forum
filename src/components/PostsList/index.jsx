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
  Stack,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  Comment,
  Visibility,
} from '@mui/icons-material';
import useNavigation from '../../hooks/useNavigation';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import PostDetailModal from '../PostDetail';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const { goToLogin, goToProfile } = useNavigation();
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:8017/v1/posts');
      if (!res.ok) throw new Error('Lỗi lấy bài viết');
      const data = await res.json();

      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const enhanced = sorted.map((post) => {
        const avatarFallback = 'https://via.placeholder.com/48';
        let image = post?.author?.avatar || avatarFallback;

        if (
          post?.author?.email &&
          user?.email &&
          post.author.email === user.email &&
          user?.avatar
        ) {
          image = user.avatar;
        }

        const createdAt = post?.createdAt ? new Date(post.createdAt) : new Date();
        const hoursAgo = formatDistanceToNow(createdAt, { addSuffix: true, locale: vi });

        return {
          ...post,
          id: post._id,
          hoursAgo,
          comments: post.comments || 0,
          views: post.views || 0,
          rating: post.rating || 4,
          image,
          imageUrl: post.imageUrl || '',
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

  const handleCardClick = (post) => {
    if (!user) {
      setSnackbarOpen(true);
      setTimeout(() => goToLogin(), 1000);
      return;
    }
    setSelectedPost(post);
  };

  const handleCloseModal = () => setSelectedPost(null);
  const handleCommentClick = (postId) => console.log(`Mở bình luận cho bài post ${postId}`);
  const handleAvatarClick = (e, post) => {
    e.stopPropagation();
    if (post.author?._id) goToProfile(post.author._id);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: 3, pt: 3 }}>
      {posts.map((post) => (
        <Card
          key={post.id}
          onClick={() => handleCardClick(post)}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            bgcolor: '#fff',
            border: '1px solid #BC3AAA',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              transform: 'translateY(-4px)',
            },
            overflow: 'hidden',
          }}
        >
          {/* Ảnh bài viết bên trái */}
          {post.imageUrl && (
            <Box
              sx={{
                width: 160,
                height: 180,
                borderTopLeftRadius: '16px',
                borderBottomLeftRadius: '16px',
                overflow: 'hidden',
                borderRight: '2px solid #BC3AAA',
              }}
            >
              <img
                src={post.imageUrl}
                alt="Ảnh bài viết"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>
          )}

          {/* Nội dung + avatar */}
          <Box sx={{ display: 'flex', flex: 1, paddingLeft: '40px' }}>
            {/* Avatar tác giả */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={post.image}
                alt={post.author?.name || 'Author'}
                sx={{
                  width: 60,
                  height: 60,
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#BC3AAA',
                    transform: 'scale(1.1)',
                  },
                }}
                onClick={(e) => handleAvatarClick(e, post)}
              />
            </Box>

            {/* Nội dung bài viết */}
            <CardContent sx={{ flex: 1, p: 2, pt: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '1.1rem',
                      color: '#1a1a1a',
                      fontWeight: 600,
                      lineHeight: 1.4,
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: '#666', fontStyle: 'italic', fontSize: '0.8rem' }}
                  >
                    {post.hoursAgo}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Rating
                    value={post.rating}
                    readOnly
                    precision={0.5}
                    sx={{ fontSize: '1.1rem', color: '#FFD700' }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCommentClick(post.id);
                    }}
                    sx={{ '&:hover': { color: '#BC3AAA' } }}
                  >
                    <Comment sx={{ fontSize: 20, color: '#FE5E7E' }} />
                  </IconButton>
                  <Checkbox
                    icon={<FavoriteBorder sx={{ fontSize: 20, color: '#FE5E7E' }} />}
                    checkedIcon={<Favorite sx={{ fontSize: 20, color: '#BC3AAA' }} />}
                    sx={{ p: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                    sx={{ '&:hover': { color: '#BC3AAA' } }}
                  >
                    <Share sx={{ fontSize: 20, color: '#FE5E7E' }} />
                  </IconButton>
                </Stack>
              </Box>

              <Divider sx={{ my: 2, borderColor: '#eee' }} />

              <Box sx={{ display: 'flex', gap: 4, color: '#666' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Comment sx={{ fontSize: 18 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    {post.comments} bình luận
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Visibility sx={{ fontSize: 18 }} />
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    {post.views} lượt xem
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Box>
        </Card>
      ))}

      {/* Modal chi tiết bài viết */}
      {selectedPost && (
        <PostDetailModal
          open={Boolean(selectedPost)}
          onClose={handleCloseModal}
          post={selectedPost}
        />
      )}
    </Box>
  );
}

export default PostList;