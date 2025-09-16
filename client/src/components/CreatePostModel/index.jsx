import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Rating, Typography, Divider,
  Autocomplete, Chip, FormControl, InputLabel , Select ,MenuItem, OutlinedInput 
} from '@mui/material';
import { getAuth } from 'firebase/auth';
import { uploadImageToCloudinary } from '~/utils/uploadImage'; 
import ImageUploader from '~/components/ImageUploader'; // Component chọn ảnh

const CITIES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'Bình Dương', 'Đồng Nai', 'Nghệ An', 'Thanh Hóa', 'Thừa Thiên Huế',
];
// 👇 thêm list chuyên khoa mặc định
const SPECIALTIES = [
  "Tim mạch",
  "Nội tiết",
  "Da liễu",
  "Nhi khoa",
  "Sản phụ khoa",
  "Ngoại tổng quát",
  "Tai mũi họng",
  "Răng hàm mặt",
  "Mắt",
  "Tâm thần"
];
const WORKPLACES_BY_CITY = {
  "Hà Nội": [
    "Bệnh viện Bạch Mai",
    "Bệnh viện Hữu nghị Việt Đức",
    "Bệnh viện K",
    "Bệnh viện Phụ sản Trung ương",
    "Bệnh viện Quân y 108",
    "Bệnh viện Đại học Y Hà Nội",
    "Bệnh viện E Trung ương"
  ],
  "TP. Hồ Chí Minh": [
    "Bệnh viện Chợ Rẫy",
    "Bệnh viện Nhi Đồng 1",
    "Bệnh viện Nhi Đồng 2",
    "Bệnh viện Từ Dũ",
    "Bệnh viện Nhân dân Gia Định",
    "Bệnh viện 115"
  ],
  "Đà Nẵng": [
    "Bệnh viện Đà Nẵng",
    "Bệnh viện C Đà Nẵng",
    "Bệnh viện Phụ sản - Nhi Đà Nẵng"
  ],
  "Hải Phòng": [
    "Bệnh viện Hữu nghị Việt Tiệp",
    "Bệnh viện Trẻ em Hải Phòng",
    "Bệnh viện Phụ sản Hải Phòng"
  ],
  "Cần Thơ": [
    "Bệnh viện Đa khoa Trung ương Cần Thơ",
    "Bệnh viện Nhi đồng Cần Thơ",
    "Bệnh viện Phụ sản Cần Thơ"
  ],
  "Bình Dương": [
    "Bệnh viện Đa khoa tỉnh Bình Dương",
    "Bệnh viện Quốc tế Becamex",
    "Bệnh viện Hoàn Hảo"
  ],
  "Đồng Nai": [
    "Bệnh viện Đa khoa Đồng Nai",
    "Bệnh viện Nhi Đồng Nai",
    "Bệnh viện Thống Nhất Đồng Nai"
  ],
  "Nghệ An": [
    "Bệnh viện Hữu nghị Đa khoa Nghệ An",
    "Bệnh viện Sản Nhi Nghệ An",
    "Bệnh viện 115 Nghệ An"
  ],
  "Thanh Hóa": [
    "Bệnh viện Đa khoa tỉnh Thanh Hóa",
    "Bệnh viện Nhi Thanh Hóa",
    "Bệnh viện Phụ sản Thanh Hóa"
  ],
  "Thừa Thiên Huế": [
    "Bệnh viện Trung ương Huế",
    "Bệnh viện Trường Đại học Y Dược Huế",
    "Bệnh viện Quốc tế Huế"
  ]
};



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
  const [tagInput, setTagInput] = useState(""); // 👈 thêm state cho input tag

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleRatingChange = (_, newValue) => {
    setForm((prev) => ({ ...prev, rating: newValue }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#*/, "");
      if (newTag && !form.tags.includes(newTag)) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setTagInput(""); // reset input sau khi add
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
        imageUrl = await uploadImageToCloudinary(imageFile);
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
      setTagInput(""); // reset tag input
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
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 700,
                  height: { xs: 250, sm: 350 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  mx: 'auto',
                  mt: 2
                }}
              >
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
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
              <Autocomplete
                freeSolo
                options={WORKPLACES_BY_CITY[form.city] || []}
                value={form.workplace}
                onChange={(_, value) => setForm(prev => ({ ...prev, workplace: value }))}
                onInputChange={(_, value) => setForm(prev => ({ ...prev, workplace: value }))}
                renderInput={(params) => (
                  <TextField {...params} label="Nơi làm việc" />
                )}
              />
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

            {/* 👇 Fix phần nhập tag */}
            <FormControl fullWidth>
              <InputLabel>Chuyên khoa</InputLabel>
              <Select
                value={form.tags[0] || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    tags: e.target.value ? [e.target.value] : []
                  }))
                }
              >
                <MenuItem value="">-- Chọn chuyên khoa --</MenuItem>
                {SPECIALTIES.map((s, i) => (
                  <MenuItem key={i} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
