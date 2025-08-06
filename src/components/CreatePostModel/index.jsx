import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Rating, Typography, Divider,
  Autocomplete, Chip
} from '@mui/material';
import { getAuth } from 'firebase/auth';
import { uploadImageToCloudinary } from '~/utils/uploadImage'; 
import ImageUploader from '~/components/ImageUploader'; // Component chọn ảnh

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
    imageUrl: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleRatingChange = (_, newValue) => {
    setForm((prev) => ({ ...prev, rating: newValue }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = e.target.value.trim().replace(/^#*/, '');
      if (newTag && !form.tags.includes(newTag)) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      e.target.value = '';
    }
  };

  const handleTagDelete = (tagToDelete) => () => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete)
    }));
  };

  const handleSubmit = async () => {
    try {
      const auth = getAuth();
      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        alert('Bạn cần đăng nhập!');
        return;
      }

      const token = await firebaseUser.getIdToken();

      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile); // ✅ Upload ảnh lên Cloudinary
      }

      const postData = {
        ...form,
        imageUrl
      };

      const res = await fetch('http://localhost:8017/v1/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      if (!res.ok) throw new Error('Tạo bài viết thất bại');
      window.dispatchEvent(new Event('postCreated'));
      const result = await res.json();
      if (onSubmit) onSubmit(result);

      // Reset form
      setForm({
        title: '',
        content: '',
        doctor: '',
        workplace: '',
        city: '',
        rating: 0,
        tags: [],
        imageUrl: ''
      });
      setImageFile(null);
      setPreviewMode(false);
      onClose();
    } catch (err) {
      console.error('❌ Lỗi khi tạo bài viết:', err);
      alert('Lỗi khi tạo bài viết!');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#FE5E7E' }}>
        {previewMode ? '🔎 Xem trước bài viết' : '✍️ Tạo bài viết'}
      </DialogTitle>

      <Divider sx={{ my: 2 }} />

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {previewMode ? (
          <>
            <Typography variant="h6">{form.title}</Typography>
            {imageFile && (
              <Box mt={2}>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="preview"
                  style={{ width: '100%', borderRadius: 10 }}
                />
              </Box>
            )}
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{form.content}</Typography>
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
            <TextField label="Tiêu đề" fullWidth value={form.title} onChange={handleChange('title')} />
            <TextField label="Nội dung" fullWidth multiline minRows={4} value={form.content} onChange={handleChange('content')} />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="Tên bác sĩ" fullWidth value={form.doctor} onChange={handleChange('doctor')} />
              <TextField label="Nơi làm việc" fullWidth value={form.workplace} onChange={handleChange('workplace')} />
            </Box>

            <Autocomplete
              options={CITIES}
              value={form.city}
              onChange={(_, value) => setForm((prev) => ({ ...prev, city: value }))}
              renderInput={(params) => <TextField {...params} label="Thành phố" />}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography fontWeight={600}>Đánh giá:</Typography>
              <Rating value={form.rating} onChange={handleRatingChange} precision={0.5} />
            </Box>

            <Box>
              <TextField label="Hashtag" placeholder="Nhấn Enter để thêm" onKeyDown={handleTagKeyDown} fullWidth />
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

            <ImageUploader imageFile={imageFile} setImageFile={setImageFile} />
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">❌ Hủy</Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? '✏️ Chỉnh sửa' : '🔎 Xem trước'}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.title || !form.content}
            sx={{ backgroundColor: '#FE5E7E', '&:hover': { backgroundColor: '#E24C6A' } }}
          >
            ✅ Đăng bài
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePostModal;
