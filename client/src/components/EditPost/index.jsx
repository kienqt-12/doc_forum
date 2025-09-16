import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axiosClient from '../../api/axiosClient';

const EditPostModal = ({ open, onClose, post, onPostUpdated }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [imageUrl, setImageUrl] = useState(post?.imageUrl || '');

  const handleUpdatePost = async () => {
    try {
      const res = await axiosClient.put(`/posts/${post._id}`, {
        title,
        content,
        imageUrl,
      });

      toast.success('Cập nhật bài viết thành công');
      if (onPostUpdated) onPostUpdated(res.data);
      onClose();
    } catch (error) {
      console.error('Lỗi khi cập nhật bài viết:', error);
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          boxShadow: '0 8px 28px rgba(0, 0, 0, 0.2)',
          border: '1px solid #BC3AAA',
          bgcolor: '#fff',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Chỉnh sửa bài viết
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#fafafa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            src={post?.author?.avatar || 'https://via.placeholder.com/48'}
            alt={post?.author?.name || 'Người dùng'}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography sx={{ fontWeight: 600 }}>{post?.author?.name}</Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              {post?.hoursAgo || 'Vừa đăng'}
            </Typography>
          </Box>
        </Box>

        <TextField
          fullWidth
          label="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Nội dung"
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="URL hình ảnh"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          sx={{ mb: 2 }}
        />

        {imageUrl && (
          <Box
            sx={{
              width: '100%',
              maxHeight: 300,
              overflow: 'hidden',
              borderRadius: '12px',
              mb: 3,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <img
              src={imageUrl}
              alt="Preview"
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleUpdatePost}
          sx={{
            bgcolor: '#BC3AAA',
            color: '#fff',
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': { bgcolor: '#a2308f' },
          }}
        >
          Lưu thay đổi
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostModal;