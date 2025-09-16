// src/services/uploadImageToCloudinary.js
import axios from 'axios';

const CLOUDINARY_UPLOAD_PRESET = 'doc-forum'; // 👈 preset của bạn
const CLOUDINARY_CLOUD_NAME = 'dw59j51k0';     // 👈 cloud name của bạn

export const uploadImageToCloudinary = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await axios.post(url, formData);
  return response.data.secure_url; // ✅ Trả về URL ảnh sau khi upload
};
