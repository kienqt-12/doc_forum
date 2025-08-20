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
  Chip,
  Grid,  
} from '@mui/material';
import {
  Close as CloseIcon,
  Favorite,
  FavoriteBorder,
  Comment as CommentIcon,
  Share as ShareIcon,
  Visibility,
  Person,
  LocalHospital,
  LocationOn,
  Reply as ReplyIcon,
} from '@mui/icons-material';
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { uploadImageToCloudinary } from '~/utils/uploadImage'; 

const PostDetailModal = ({ open, onClose, post, onUpdatePost }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentImage, setCommentImage] = useState(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});
  const commentFormRef = useRef(null);

  // Kiểm tra nếu post không tồn tại
  if (!post) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Typography color="error">Không có dữ liệu bài viết!</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!post._id) {
        toast.error('ID bài viết không hợp lệ');
        return;
      }

      try {
        const { data } = await axiosClient.get(`/posts/${post._id}`);
        setLikes(data.likes?.length || 0);
        setIsLiked(data.isLiked || false);
        setComments(Array.isArray(data.comments) ? data.comments.filter(c => c && c._id) : []);
      } catch (error) {
        console.error('❌ Lỗi khi tải chi tiết bài viết:', error);
        toast.error(error.response?.data?.message || 'Lỗi khi tải chi tiết bài viết');
      }
    };

    fetchPostDetail();
  }, [post._id]);

  const handleCommentClick = () => {
    setShowCommentForm(true);
    setTimeout(() => {
      commentFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleLikeToggle = async () => {
    if (!post._id) {
      toast.error('ID bài viết không hợp lệ');
      return;
    }

    try {
      const res = await axiosClient.post(`/posts/${post._id}/like`);
      const updated = await axiosClient.get(`/posts/${post._id}`);

      const updatedPost = {
        ...post,
        ...updated.data,
        comments: Array.isArray(updated.data.comments) ? updated.data.comments.filter(c => c && c._id) : [],
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
    if (!post._id) {
      toast.error('ID bài viết không hợp lệ');
      return;
    }

    if (!commentText.trim() && !commentImage) {
      toast.error('Bình luận không được để trống');
      return;
    }

    try {
      let imageUrl = "";

      // Nếu có ảnh thì upload lên Cloudinary trước
      if (commentImage) {
        imageUrl = await uploadImageToCloudinary(commentImage);
      }

      // Gửi comment sang backend
      await axiosClient.post(`/posts/${post._id}/comment`, {
        content: commentText.trim(),
        imageUrl
      });

      // Load lại post để cập nhật comments
      const updated = await axiosClient.get(`/posts/${post._id}`);
      const safeComments = Array.isArray(updated.data.comments)
        ? updated.data.comments.filter(c => c && c._id)
        : [];

      setComments(safeComments);
      setCommentText('');
      setCommentImage(null);

      if (onUpdatePost) {
        const updatedPost = { ...post, ...updated.data };
        onUpdatePost(updatedPost);
      }

      toast.success('Bình luận đã được gửi!');
    } catch (err) {
      console.error('❌ Lỗi khi gửi bình luận:', err);
      toast.error(err.response?.data?.message || 'Lỗi khi gửi bình luận');
    }
  };

  const handleReplyClick = (commentId) => {
    setShowReplyForm((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReplySubmit = async (commentId) => {
    if (!post._id) {
      toast.error('ID bài viết không hợp lệ');
      return;
    }

    if (!commentId) {
      toast.error('ID bình luận không hợp lệ');
      return;
    }

    if (!replyText[commentId]?.trim()) {
      toast.error('Nội dung trả lời không được để trống');
      return;
    }

    try {
      await axiosClient.post(`/posts/${post.id}/comments/${commentId}/reply`, {
        content: replyText[commentId].trim(),
      });


      const updated = await axiosClient.get(`/posts/${post._id}`);
      const safeComments = Array.isArray(updated.data.comments) ? updated.data.comments.filter(c => c && c._id) : [];

      setComments(safeComments);
      setReplyText((prev) => ({ ...prev, [commentId]: '' }));
      setShowReplyForm((prev) => ({ ...prev, [commentId]: false }));

      if (onUpdatePost) {
        const updatedPost = { ...post, ...updated.data };
        onUpdatePost(updatedPost);
      }

      toast.success('Trả lời đã được gửi!');
    } catch (err) {
      console.error('❌ Lỗi khi gửi trả lời:', err);
      toast.error(err.response?.data?.message || 'Lỗi khi gửi trả lời');
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
            src={post.author?.avatar || 'https://via.placeholder.com/48'}
            alt={post.author?.name || 'Author'}
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
              {post.author?.name || 'Người dùng'}
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
              {post.hoursAgo || 'Vừa đăng'}
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
          {post.title || 'Chi tiết bài viết'}
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
          {post.content || 'Nội dung bài viết sẽ hiển thị tại đây.'}
        </Typography>

        {/* Thông tin chuyên môn */}
        <Box
          sx={{
            mt: 3,
            p: { xs: 2, sm: 3 },
            mb: 3,
            borderRadius: 2,
            bgcolor: '#f8f0f9',
            border: '1px solid #e8d1e9',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(188, 58, 170, 0.15)',
            },
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              fontSize: '1.1rem',
              color: '#BC3AAA',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <LocalHospital sx={{ fontSize: 20, color: '#BC3AAA' }} />
            Thông tin chuyên môn
          </Typography>

          <Grid container spacing={2}>
            {post.doctor && (
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Person sx={{ color: '#BC3AAA', fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: '#333', fontSize: '0.9rem' }}>
                    <strong>Bác sĩ:</strong> {post.doctor}
                  </Typography>
                </Stack>
              </Grid>
            )}
            {post.workplace && (
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LocalHospital sx={{ color: '#BC3AAA', fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: '#333', fontSize: '0.9rem' }}>
                    <strong>Nơi làm việc:</strong> {post.workplace}
                  </Typography>
                </Stack>
              </Grid>
            )}
            {post.city && (
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LocationOn sx={{ color: '#BC3AAA', fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: '#333', fontSize: '0.9rem' }}>
                    <strong>Thành phố:</strong> {post.city}
                  </Typography>
                </Stack>
              </Grid>
            )}
          </Grid>

          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <Box sx={{ mt: 2.5 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#333',
                  fontSize: '0.9rem',
                  mb: 1.5,
                }}
              >
                Chuyên khoa:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {post.tags.map((tag, idx) => (
                  <Chip
                    key={idx}
                    label={`#${tag}`}
                    size="small"
                    sx={{
                      bgcolor: '#e8d1e9',
                      color: '#BC3AAA',
                      fontWeight: 500,
                      fontSize: '0.8rem',
                      borderRadius: '12px',
                      px: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: '#BC3AAA',
                        color: '#fff',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Hình ảnh */}
        {post.imageUrl && (
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
              value={post.rating || 4}
              readOnly
              precision={0.5}
              sx={{ fontSize: '1.2rem', color: '#FFD700', opacity: 0.9 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CommentIcon sx={{ fontSize: 20, color: '#FE5E7E' }} />
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.85rem' }}>
                {comments.length} bình luận
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Visibility sx={{ fontSize: 20, color: '#FE5E7E' }} />
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.85rem' }}>
                {post.views || 0} lượt xem
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Favorite sx={{ fontSize: 20, color: isLiked ? '#BC3AAA' : '#FE5E7E' }} />
              <Typography variant="body2" sx={{ color: '#555', fontSize: '0.85rem' }}>
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
              sx={{ mb: 2 }}
            />

{/* Nút chọn ảnh (ẩn input) */}
{/* Nút chọn ảnh */}
<IconButton
  component="label"
  sx={{
    bgcolor: "#f0f2f5",
    borderRadius: "8px",
    p: 1,
    "&:hover": { bgcolor: "#e4e6eb" },
  }}
>
  <AddPhotoAlternateIcon sx={{ color: "#65676b" }} />
  <input
    type="file"
    accept="image/*"
    hidden
    onChange={(e) => setCommentImage(e.target.files[0])}
  />
</IconButton>

{/* Preview ảnh nếu có */}
{commentImage && (
  <Box
    sx={{
      mt: 1.5,
      position: "relative",
      display: "inline-block",
      maxWidth: 200,
    }}
  >
    <img
      src={URL.createObjectURL(commentImage)}
      alt="Preview"
      style={{
        width: "100%",
        borderRadius: "8px",
        objectFit: "cover",
      }}
    />
    {/* Nút xóa ảnh */}
    <IconButton
      size="small"
      onClick={() => setCommentImage(null)}
      sx={{
        position: "absolute",
        top: 4,
        right: 4,
        bgcolor: "rgba(0,0,0,0.6)",
        color: "#fff",
        "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
      }}
    >
      ✕
    </IconButton>
  </Box>
)}
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
          {Array.isArray(comments) && comments.length > 0 ? (
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
                          mb: 1,
                        }}
                      >
                        {comment.content}
                      </Typography>
                      {comment.imageUrl && (
                        <Box sx={{ mt: 1, maxWidth: "70%" }}>
                          <img
                            src={comment.imageUrl}
                            alt="Ảnh bình luận"
                            style={{
                              width: "30%",
                              height: "auto",
                              borderRadius: "12px",
                              objectFit: "cover",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                              transition: "transform 0.2s ease-in-out",
                              cursor: "pointer",
                            }}
                            onClick={() => window.open(comment.imageUrl, "_blank")} // click mở ảnh gốc
                            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                          />
                        </Box>
                      )}
                      <Button
                        size="small"
                        startIcon={<ReplyIcon />}
                        onClick={() => handleReplyClick(comment._id)}
                        sx={{
                          color: '#BC3AAA',
                          textTransform: 'none',
                          fontSize: '0.8rem',
                        }}
                      >
                        Trả lời
                      </Button>
                    </Box>
                  </Box>

                  {/* Form trả lời */}
                  {showReplyForm[comment._id] && (
                    <Box
                      sx={{
                        mt: 2,
                        ml: 5,
                        bgcolor: '#f9f9f9',
                        borderRadius: '8px',
                        p: 2,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={replyText[comment._id] || ''}
                        onChange={(e) =>
                          setReplyText((prev) => ({ ...prev, [comment._id]: e.target.value }))
                        }
                        placeholder="Viết câu trả lời của bạn..."
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            '& fieldset': { borderColor: '#BC3AAA' },
                            '&:hover fieldset': { borderColor: '#BC3AAA' },
                          },
                        }}
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          onClick={() => handleReplySubmit(comment._id)}
                          disabled={!replyText[comment._id]?.trim()}
                          sx={{
                            bgcolor: '#BC3AAA',
                            color: '#fff',
                            borderRadius: '8px',
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#a2308f' },
                          }}
                        >
                          Gửi trả lời
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleReplyClick(comment._id)}
                          sx={{
                            borderColor: '#BC3AAA',
                            color: '#BC3AAA',
                            borderRadius: '8px',
                            textTransform: 'none',
                            '&:hover': { borderColor: '#a2308f', color: '#a2308f' },
                          }}
                        >
                          Hủy
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {/* Hiển thị các câu trả lời (replies) */}
                  {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                    <Box sx={{ ml: 5, mt: 2 }}>
                      <Stack spacing={1}>
                        {comment.replies
                          .filter((reply) => reply && reply._id)
                          .map((reply) => (
                            <Box
                              key={reply._id}
                              sx={{
                                bgcolor: '#f9f9f9',
                                borderRadius: '8px',
                                p: 1.5,
                                boxShadow: '0 1px 6px rgba(0, 0, 0, 0.05)',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                <Avatar
                                  src={reply.user?.avatar}
                                  alt={reply.user?.name || 'Ẩn danh'}
                                  sx={{
                                    width: 28,
                                    height: 28,
                                    border: '1px solid #BC3AAA',
                                  }}
                                />
                                <Box sx={{ flex: 1 }}>
                                  <Box
                                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        color: '#1a1a1a',
                                      }}
                                    >
                                      {reply.user?.name || 'Ẩn danh'}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: '#666',
                                        fontSize: '0.7rem',
                                      }}
                                    >
                                      {new Date(reply.createdAt).toLocaleString()}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontSize: '0.8rem',
                                      color: '#333',
                                      lineHeight: 1.5,
                                    }}
                                  >
                                    {reply.content}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          ))}
                      </Stack>
                    </Box>
                  )}
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