// ⬇️ Không đổi phần import
import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, TextField, Button, Stack
} from '@mui/material';
import { toast } from 'react-toastify';
import axiosClient from '../../api/axiosClient';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 520,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '16px'
};

function EditPostModal({ open, onClose, post, onPostUpdated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setImageUrl(post.imageUrl || '');
    }
  }, [post]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Tiêu đề và nội dung không được để trống!');
      return;
    }

    try {
      const res = await axiosClient.put(`/posts/${post.id}`, {
        title: title.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim()
      });

      toast.success('Cập nhật bài viết thành công!');
      onPostUpdated(res.data); // Gửi dữ liệu mới về cha
      onClose();
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật bài viết:', err);
      toast.error(err.response?.data?.message || 'Lỗi khi cập nhật bài viết');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Chỉnh sửa bài viết
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Tiêu đề"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Nội dung"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <TextField
            label="URL ảnh (tuỳ chọn)"
            fullWidth
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={onClose} variant="outlined" color="secondary">
              Huỷ
            </Button>
            <Button variant="contained" onClick={handleUpdate} sx={{ bgcolor: '#BC3AAA', '&:hover': { bgcolor: '#a2308f' } }}>
              Lưu thay đổi
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

export default EditPostModal;
