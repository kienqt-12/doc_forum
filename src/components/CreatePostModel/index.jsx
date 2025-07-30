import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Rating,
  Typography,
  Divider,
  Autocomplete,
  Chip,
} from '@mui/material';

const CITIES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'Bình Dương', 'Đồng Nai', 'Nghệ An', 'Thanh Hóa', 'Thừa Thiên Huế',
];

const CreatePostModal = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    doctor: '',
    workplace: '',
    city: '',
    rating: 0,
    tags: [],
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleRatingChange = (_, newValue) => {
    setForm((prev) => ({ ...prev, rating: newValue }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = e.target.value.trim().replace(/^#*/, '');
      if (newTag && !form.tags.includes(newTag)) {
        setForm((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      e.target.value = '';
    }
  };

  const handleTagDelete = (tagToDelete) => () => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit(form);
    onClose();
    setForm({
      title: '',
      content: '',
      doctor: '',
      workplace: '',
      city: '',
      rating: 0,
      tags: [],
    });
    setPreviewMode(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#FE5E7E' }}>
        {previewMode ? '🔎 Xem trước bài viết' : '✍️ Tạo bài viết mới'}
      </DialogTitle>

      <Divider sx={{ my: 2 }} />

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {previewMode ? (
          <>
            <Typography variant="h6">{form.title}</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {form.content}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography><strong>Bác sĩ:</strong> {form.doctor}</Typography>
            <Typography><strong>Nơi làm việc:</strong> {form.workplace}</Typography>
            <Typography><strong>Thành phố:</strong> {form.city}</Typography>
            <Typography><strong>Đánh giá:</strong> {form.rating} ⭐</Typography>
            <Box mt={2}>
              {form.tags.map((tag, idx) => (
                <Chip key={idx} label={`#${tag}`} sx={{ mr: 1, mb: 1 }} />
              ))}
            </Box>
          </>
        ) : (
          <>
            <TextField
              label="Tiêu đề"
              placeholder="VD: Trải nghiệm khám tại BV Nhân dân Gia Định"
              fullWidth
              value={form.title}
              onChange={handleChange('title')}
            />

            <TextField
              label="Nội dung"
              placeholder="Chia sẻ chi tiết trải nghiệm khám chữa bệnh..."
              fullWidth
              multiline
              minRows={5}
              value={form.content}
              onChange={handleChange('content')}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Tên bác sĩ"
                fullWidth
                value={form.doctor}
                onChange={handleChange('doctor')}
              />
              <TextField
                label="Nơi làm việc"
                fullWidth
                value={form.workplace}
                onChange={handleChange('workplace')}
              />
            </Box>

            <Autocomplete
              options={CITIES}
              value={form.city}
              onChange={(_, newValue) => setForm((prev) => ({ ...prev, city: newValue }))}
              renderInput={(params) => <TextField {...params} label="Thành phố" />}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography fontWeight={600}>Đánh giá:</Typography>
              <Rating
                name="rating"
                value={form.rating}
                onChange={handleRatingChange}
                precision={0.5}
                sx={{ color: '#FFD700' }}
              />
            </Box>

            <Box>
              <TextField
                label="Hashtag / Chuyên khoa"
                placeholder="Nhấn Enter để thêm (VD: #tim, #sản)"
                fullWidth
                onKeyDown={handleTagKeyDown}
              />
              <Box mt={1}>
                {form.tags.map((tag, idx) => (
                  <Chip
                    key={idx}
                    label={`#${tag}`}
                    onDelete={handleTagDelete(tag)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderColor: '#ccc',
            color: '#555',
            '&:hover': {
              borderColor: '#999',
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          ❌ Hủy
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={() => setPreviewMode(!previewMode)}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: '#FE5E7E',
              color: '#FE5E7E',
            }}
          >
            {previewMode ? '✏️ Chỉnh sửa' : '🔎 Xem trước'}
          </Button>

          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!form.title || !form.content}
            sx={{
              backgroundColor: '#FE5E7E',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#E24C6A',
              },
            }}
          >
            ✅ Đăng bài viết
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePostModal;
