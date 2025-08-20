// utils/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8017/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor để tự động thêm token trước khi gửi request
axiosClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('accessToken'); // Lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
