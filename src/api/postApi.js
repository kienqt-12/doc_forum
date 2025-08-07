// src/api/postApi.js
import axiosClient from './axiosClient';

const postApi = {
  getAll: () => axiosClient.get('/posts'),

  getById: (id) => axiosClient.get(`/posts/${id}`),

  like: (id) => axiosClient.post(`/posts/${id}/like`),

  comment: (id, content) =>
    axiosClient.post(`/posts/${id}/comment`, { content }),

  delete: (id) => axiosClient.delete(`/posts/${id}`),

  update: (id, data) => axiosClient.put(`/posts/${id}`, data),
};

export default postApi;
