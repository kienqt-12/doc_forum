// src/components/ImageUploader.jsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const ImageUploader = ({ imageFile, setImageFile }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleRemoveImage = () => setImageFile(null);

  return (
    <Box>
      <Typography fontWeight={600} sx={{ mb: 1 }}>Ảnh minh họa:</Typography>

      {!imageFile ? (
        <Box
          onClick={() => document.getElementById('image-input').click()}
          sx={{
            border: '2px dashed #FE5E7E',
            borderRadius: 2,
            padding: 3,
            textAlign: 'center',
            cursor: 'pointer',
            color: '#aaa',
            '&:hover': {
              borderColor: '#E24C6A',
              color: '#E24C6A',
              backgroundColor: '#fff6f7',
            },
          }}
        >
          <Typography>📁 Kéo hoặc click để chọn ảnh từ thiết bị</Typography>
          <input
            id="image-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </Box>
      ) : (
        <Box sx={{ position: 'relative', mt: 2 }}>
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 12 }}
          />
          <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              onClick={() => document.getElementById('image-input').click()}
              sx={{ fontSize: 12, px: 1.5 }}
            >
              Thay ảnh
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={handleRemoveImage}
              sx={{ fontSize: 12, px: 1.5 }}
            >
              Xóa
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ImageUploader;
