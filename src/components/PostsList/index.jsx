import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Avatar,
  IconButton, Rating, Divider, Stack
} from '@mui/material';
import {
  Favorite, FavoriteBorder, Share,
  Comment, Visibility
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

        const likesArray = post.likes || [];
        const isLiked = user ? likesArray.includes(user._id) : false;

        return {
          ...post,
          id: post._id,
          hoursAgo,
          comments: post.comments?.length || 0,
          views: post.views || 0,
          rating: post.rating || 4,
          image,
          imageUrl: post.imageUrl || '',
          likesCount: likesArray.length,
          isLiked
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

    // ✅ Thêm currentUserId vào post để truyền vào Modal
    setSelectedPost({
      ...post,
      currentUserId: user._id
    });
  };

  const handleCloseModal = () => setSelectedPost(null);

  const handleAvatarClick = (e, post) => {
    e.stopPropagation();
    if (post.author?._id) goToProfile(post.author._id);
  };

  const handleLike = async (e, post) => {
    e.stopPropagation();
    if (!user) {
      setSnackbarOpen(true);
      setTimeout(() => goToLogin(), 1000);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8017/v1/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      });

      if (!res.ok) throw new Error('Lỗi khi like bài viết');

      const updatedPosts = posts.map((p) =>
        p.id === post.id
          ? {
              ...p,
              isLiked: !p.isLiked,
              likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1
            }
          : p
      );

      setPosts(updatedPosts);
    } catch (err) {
      console.error('❌ Like error:', err);
    }
  };

  // ✅ Nhận post mới từ Modal sau khi comment và cập nhật lại danh sách
  const handleUpdatePost = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === updatedPost._id
          ? {
              ...p,
              ...updatedPost,
              comments: updatedPost.comments?.length || 0,
              likesCount: updatedPost.likes?.length || 0,
              isLiked: updatedPost.likes?.includes(user._id)
            }
          : p
      )
    );

    // ✅ Cập nhật lại modal nếu đang mở
    setSelectedPost((prev) =>
      prev?._id === updatedPost._id
        ? {
            ...updatedPost,
            currentUserId: user._id
          }
        : prev
    );
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
              transform: 'translateY(-4px)'
            },
            overflow: 'hidden'
          }}
        >
          {post.imageUrl && (
            <Box sx={{ width: 160, height: 180, borderRight: '2px solid #BC3AAA' }}>
              <img src={post.imageUrl} alt="Ảnh bài viết" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          )}

          <Box sx={{ display: 'flex', flex: 1, paddingLeft: '40px' }}>
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
                    transform: 'scale(1.1)'
                  }
                }}
                onClick={(e) => handleAvatarClick(e, post)}
              />
            </Box>

            <CardContent sx={{ flex: 1, p: 2, pt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    {post.hoursAgo}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Rating value={post.rating} readOnly precision={0.5} sx={{ fontSize: '1.1rem', color: '#FFD700' }} />
                  <IconButton size="small" sx={{ '&:hover': { color: '#BC3AAA' } }}>
                    <Comment sx={{ fontSize: 20, color: '#FE5E7E' }} />
                  </IconButton>
                  <IconButton size="small" onClick={(e) => handleLike(e, post)} sx={{ '&:hover': { color: '#BC3AAA' } }}>
                    {post.isLiked ? (
                      <Favorite sx={{ fontSize: 20, color: '#BC3AAA' }} />
                    ) : (
                      <FavoriteBorder sx={{ fontSize: 20, color: '#FE5E7E' }} />
                    )}
                  </IconButton>
                  <Typography variant="caption">{post.likesCount}</Typography>
                  <IconButton size="small" sx={{ '&:hover': { color: '#BC3AAA' } }}>
                    <Share sx={{ fontSize: 20, color: '#FE5E7E' }} />
                  </IconButton>
                </Stack>
              </Box>

              <Divider sx={{ my: 2 }} />

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

      {selectedPost && (
        <PostDetailModal
          open={Boolean(selectedPost)}
          onClose={handleCloseModal}
          post={selectedPost}
          onUpdatePost={handleUpdatePost} // ✅ Truyền callback cập nhật lại bài viết
        />
      )}
    </Box>
  );
}

export default PostList;
