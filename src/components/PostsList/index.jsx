import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Avatar,
  IconButton, Rating, Divider, Stack, TextField, Button, Menu, MenuItem,Grid,Chip
} from '@mui/material';
import {
  Favorite, FavoriteBorder, Share, Comment, Visibility, MoreVert,
  Person,PersonOutline,Business,
  LocalHospital,
  LocationOn,
} from '@mui/icons-material';
import useNavigation from '../../hooks/useNavigation';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import PostDetailModal from '../PostDetail';
import EditPostModal from '../EditPost';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

function PostList({ userId }) {
  const [posts, setPosts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState({});
  const [commentText, setCommentText] = useState({});
  const commentFormRef = useRef({});
  const { goToLogin, goToProfile } = useNavigation();
  const { user } = useAuth();
  const [anchorEls, setAnchorEls] = useState({});

  const [editingPost, setEditingPost] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await axiosClient.get('/posts');
      if (!res.data) throw new Error('Lỗi lấy bài viết');

      let data = res.data;
      if (userId) {
        data = data.filter((post) => post.author?._id === userId);
      }

      const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const enhanced = sorted.map((post) => {
        const avatarFallback = 'https://via.placeholder.com/48';
        let image = post?.author?.avatar || avatarFallback;

        if (post?.author?.email && user?.email && post.author.email === user.email && user?.avatar) {
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
          isLiked,
          doctor: post.doctor || '',
          workplace: post.workplace || '',
          city: post.city || '',
          tags: post.tags || [],
        };
      });

      setPosts(enhanced);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải bài viết');
    }
  };

  useEffect(() => {
    fetchPosts();
    const handleNewPost = () => fetchPosts();
    window.addEventListener('postCreated', handleNewPost);
    return () => window.removeEventListener('postCreated', handleNewPost);
  }, [user, userId]);

  const handleCardClick = (post) => {
    if (!user) {
      setSnackbarOpen(true);
      setTimeout(() => goToLogin(), 1000);
      return;
    }
    setSelectedPost({ ...post, currentUserId: user._id });
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
      const res = await axiosClient.post(`/posts/${post.id}/like`);
      const updated = await axiosClient.get(`/posts/${post.id}`);

      const updatedPost = {
        ...posts.find((p) => p.id === post.id),
        ...updated.data,
        comments: updated.data.comments?.length || 0,
        likesCount: updated.data.likes?.length || 0,
        isLiked: updated.data.likes?.includes(user._id),
        rating: updated.data.rating || 4,
        image: posts.find((p) => p.id === post.id)?.image
      };

      setPosts((prev) => prev.map((p) => (p.id === post.id ? updatedPost : p)));

      if (selectedPost?.id === post.id) {
        setSelectedPost(updatedPost);
      }

      toast.success(res.data.liked ? 'Đã thích bài viết!' : 'Đã bỏ thích bài viết!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi thích bài viết');
    }
  };

  const handleCommentClick = (postId) => {
    if (!user) {
      setSnackbarOpen(true);
      setTimeout(() => goToLogin(), 1000);
      return;
    }

    setShowCommentForm((prev) => ({ ...prev, [postId]: true }));

    setTimeout(() => {
      if (commentFormRef.current[postId]) {
        commentFormRef.current[postId].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

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

    setSelectedPost((prev) =>
      prev?._id === updatedPost._id
        ? { ...updatedPost, currentUserId: user._id }
        : prev
    );
  };

  const handleDeletePost = async (e, postId) => {
    e.stopPropagation();
    try {
      await axiosClient.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success('Đã xoá bài viết');
    } catch (error) {
      toast.error('Không thể xoá bài viết');
    }
  };

  const handleEditPost = (e, post) => {
    e.stopPropagation();
    setEditingPost(post);
    setEditModalOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: 3, pt: 3 }}>
      {posts.map((post) => {
        const isOwnPost = user?._id === post.author?._id;
        const anchorEl = anchorEls[post.id] || null;
        return (
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
                <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                      {post?.doctor && (
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          bgcolor: '#F3E5F5',
                          borderRadius: '12px',
                          p: 1,
                          transition: 'all 0.3s ease',
                          '&:hover': { bgcolor: '#E1BEE7' }
                        }}>
                          <LocalHospital sx={{ color: '#BC3AAA', fontSize: 20, mr: 0.5 }} />
                          <Typography variant="body2" sx={{ color: '#8E24AA', fontWeight: 500, fontSize: '0.9rem', mr: 1 }}>
                            {post.doctor}
                          </Typography>
                          <Rating
                            value={post.rating}
                            readOnly
                            precision={0.5}
                            sx={{ fontSize: '1rem', color: '#FFD700' }}
                          />
                        </Box>
                      )}
                {isOwnPost && (
                  <Box sx={{ marginLeft: 'auto' }}>
                    <IconButton onClick={(e) => {
                      e.stopPropagation();
                      setAnchorEls((prev) => ({ ...prev, [post.id]: e.currentTarget }));
                    }}>
                      <MoreVert />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEls((prev) => ({ ...prev, [post.id]: null }))}
                    >
                      <MenuItem onClick={(e) => handleEditPost(e, post)}>Chỉnh sửa</MenuItem>
                      <MenuItem onClick={(e) => handleDeletePost(e, post.id)}>Xoá bài viết</MenuItem>
                    </Menu>
                  </Box>
                )}
              </Stack>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', gap: 4, color: '#666', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleLike(e, post); }} sx={{ '&:hover': { color: '#BC3AAA' } }}>
                      {post.isLiked ? (
                        <Favorite sx={{ fontSize: 20, color: '#BC3AAA' }} />
                      ) : (
                        <FavoriteBorder sx={{ fontSize: 20, color: '#FE5E7E' }} />
                      )}
                </IconButton>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      {post.likesCount} lượt thích
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleCommentClick(post.id); }} sx={{ '&:hover': { color: '#BC3AAA' } }}>
                      <Comment sx={{ fontSize: 18, color: '#FE5E7E' }} />
                </IconButton>
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
              {post.tags.length > 0 && (
              <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {post.tags.map((tag, idx) => (
                  <Chip
                    key={idx}
                    label={`#${tag}`}
                    size="small"
                    sx={{
                      bgcolor: '#F3E5F5',
                      color: '#8E24AA',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                    }}
                  />
                ))}
              </Box>
            )}
            </CardContent>
            </Box>
          </Card>
        );
      })}

      {selectedPost && (
        <PostDetailModal
          open={Boolean(selectedPost)}
          onClose={() => setSelectedPost(null)}
          post={selectedPost}
          onUpdatePost={handleUpdatePost}
        />
      )}

      {editingPost && (
        <EditPostModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          post={editingPost}
          onPostUpdated={(updated) => {
            handleUpdatePost(updated);
            setEditModalOpen(false);
          }}
        />
      )}
    </Box>
  );
}

export default PostList;
