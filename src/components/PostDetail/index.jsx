import React, { useState, useRef, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Divider,
  Avatar,
  Stack,
  Rating,
  Checkbox,
  TextField,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  Favorite,
  FavoriteBorder,
  Comment as CommentIcon,
  Share as ShareIcon,
  Visibility,
} from '@mui/icons-material';

const PostDetailModal = ({ open, onClose, post, onUpdatePost }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [animateLike, setAnimateLike] = useState({});
  const commentFormRef = useRef(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (post && post._id) {
        try {
          const { data } = await axiosClient.get(`/posts/${post._id}`);
          setLikes(data.likes?.length || 0);
          setIsLiked(post.isLiked || false); // Cập nhật trạng thái like từ props
          setComments(Array.isArray(data.comments) ? data.comments : []);
        } catch (error) {
          console.error('❌ Lỗi khi tải chi tiết bài viết:', error);
          toast.error(error.response?.data?.message || 'Lỗi khi tải chi tiết bài viết');
        }
      }
    };

    fetchPostDetail();
  }, [post?._id]);

  const handleCommentClick = () => {
    setShowCommentForm(true);
    setTimeout(() => {
      commentFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleLikeToggle = async () => {
    try {
      const res = await axiosClient.post(`/posts/${post._id}/like`);
      const updated = await axiosClient.get(`/posts/${post._id}`);

      const updatedPost = {
        ...post,
        ...updated.data,
        comments: updated.data.comments || post.comments || [],
        isLiked: res.data.liked,
        likesCount: updated.data.likes?.length || res.data.totalLikes,
      };

      setIsLiked(res.data.liked);
      setLikes(res.data.totalLikes);

      if (onUpdatePost) onUpdatePost(updatedPost);
    } catch (err) {
      console.error('❌ Lỗi khi like bài viết:', err);
      toast.error(err.response?.data?.message || 'Lỗi khi thích bài viết');
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      toast.error('Nội dung bình luận không được để trống');
      return;
    }

    try {
      await axiosClient.post(`/posts/${post._id}/comment`, {
        content: commentText.trim(),
      });

      const updated = await axiosClient.get(`/posts/${post._id}`);
      const safeComments = Array.isArray(updated.data.comments) ? updated.data.comments : [];

      setComments(safeComments);
      setCommentText('');

      if (onUpdatePost) {
        const updatedPost = {
          ...post,
          ...updated.data,
        };
        onUpdatePost(updatedPost);
      }

      toast.success('Bình luận đã được gửi!');
    } catch (err) {
      console.error('❌ Lỗi khi gửi bình luận:', err);
      toast.error(err.response?.data?.message || 'Lỗi khi gửi bình luận');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          boxShadow: '0 8px 28px rgba(0, 0, 0, 0.2)',
          border: '1px solid #BC3AAA',
          maxWidth: '960px',
          bgcolor: '#fff',
          margin: { xs: 1, sm: 2 },
        },
      }}
    >
      <DialogTitle sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: '#fff' }}>
        <Box sx={{ flex: 1 }} />
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: '#666',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: '#BC3AAA',
              bgcolor: 'rgba(188, 58, 170, 0.1)',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 4 }, bgcolor: '#fafafa' }}>
        {/* Tác giả */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            src={post?.author?.avatar || 'https://via.placeholder.com/48'}
            alt={post?.author?.name || 'Author'}
            sx={{
              width: 48,
              height: 48,
              border: '2px solid transparent',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#BC3AAA',
                transform: 'scale(1.08)',
              },
            }}
          />
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: '#1a1a1a',
                lineHeight: 1.5,
              }}
            >
              {post?.author?.name || 'Người dùng'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#666',
                fontStyle: 'italic',
                fontSize: '0.85rem',
                lineHeight: 1.8,
              }}
            >
              {post?.hoursAgo || 'Vừa đăng'}
            </Typography>
          </Box>
        </Box>

        {/* Tiêu đề & nội dung */}
        <Typography
          variant="h5"
          sx={{
            fontSize: '1.4rem',
            fontWeight: 600,
            color: '#1a1a1a',
            lineHeight: 1.4,
            mb: 2,
          }}
        >
          {post?.title || 'Chi tiết bài viết'}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1rem',
            color: '#333',
            lineHeight: 1.6,
            mb: 3,
          }}
        >
          {post?.content || 'Nội dung bài viết sẽ hiển thị tại đây.'}
        </Typography>

        {/* Hình ảnh */}
        {post?.imageUrl && (
          <Box
            sx={{
              width: { xs: '100%', sm: '100%' },
              maxWidth: 700,
              height: { xs: 250, sm: 350 },
              borderRadius: '16px',
              overflow: 'hidden',
              mb: 3,
              mx: 'auto',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
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

        {/* Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Rating
              value={post?.rating || 4}
              readOnly
              precision={0.5}
              sx={{ fontSize: '1.2rem', color: '#FFD700', opacity: 0.9 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CommentIcon sx={{ fontSize: 20, color: '#FE5E7E' }} />
              <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#555' }}>
                {comments.length} bình luận
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Visibility sx={{ fontSize: 20, color: '#FE5E7E' }} />
              <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#555' }}>
                {post?.views || 0} lượt xem
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Favorite sx={{ fontSize: 20, color: isLiked ? '#BC3AAA' : '#FE5E7E' }} />
              <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#555' }}>
                {likes} lượt thích
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={handleCommentClick}
              sx={{
                '&:hover': { color: '#BC3AAA', bgcolor: 'rgba(188, 58, 170, 0.1)' },
              }}
            >
              <CommentIcon sx={{ fontSize: 24, color: '#FE5E7E' }} />
            </IconButton>
            <Checkbox
              icon={<FavoriteBorder sx={{ fontSize: 24, color: '#FE5E7E' }} />}
              checkedIcon={<Favorite sx={{ fontSize: 24, color: '#BC3AAA' }} />}
              checked={isLiked}
              onChange={(e) => {
                e.stopPropagation();
                handleLikeToggle();
              }}
              sx={{ p: 0 }}
            />
            <IconButton
              size="small"
              onClick={(e) => e.stopPropagation()}
              sx={{
                '&:hover': { color: '#BC3AAA', bgcolor: 'rgba(188, 58, 170, 0.1)' },
              }}
            >
              <ShareIcon sx={{ fontSize: 24, color: '#FE5E7E' }} />
            </IconButton>
          </Stack>
        </Box>

        <Divider sx={{ my: 2, borderColor: 'rgba(188, 58, 170, 0.2)' }} />

        {/* Bình luận */}
        {showCommentForm && (
          <Box
            ref={commentFormRef}
            sx={{
              mb: 3,
              bgcolor: '#fff',
              borderRadius: '8px',
              p: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <TextField
              fullWidth
              multiline
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#BC3AAA' },
                  '&:hover fieldset': { borderColor: '#BC3AAA' },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleCommentSubmit}
              disabled={!commentText.trim()}
              sx={{
                bgcolor: '#BC3AAA',
                color: '#fff',
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': { bgcolor: '#a2308f' },
              }}
            >
              Gửi bình luận
            </Button>
          </Box>
        )}

        <Box>
          <Typography
            variant="h6"
            sx={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#1a1a1a',
              mb: 2,
            }}
          >
            Bình luận ({comments.length})
          </Typography>
          {comments.length > 0 ? (
            <Stack spacing={2}>
              {comments.map((comment) => (
                <Box
                  key={comment._id}
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: '12px',
                    p: 2,
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(188, 58, 170, 0.2)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
                    <Avatar
                      src={comment.user?.avatar}
                      alt={comment.user?.name || 'Ẩn danh'}
                      sx={{
                        width: 36,
                        height: 36,
                        border: '1px solid #BC3AAA',
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            color: '#1a1a1a',
                          }}
                        >
                          {comment.user?.name || 'Ẩn danh'}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#666',
                            fontSize: '0.75rem',
                          }}
                        >
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.85rem',
                          color: '#333',
                          lineHeight: 1.5,
                        }}
                      >
                        {comment.content}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : (
            <Box
              sx={{
                bgcolor: '#fff',
                borderRadius: '12px',
                p: 2,
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                Chưa có bình luận. Hãy là người đầu tiên bình luận!
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetailModal;