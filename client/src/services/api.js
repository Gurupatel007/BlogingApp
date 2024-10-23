import axios from 'axios';

const API_URL = 'https://blogappbackend.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const getPublicBlogs = () => api.get('/blogs/public');
export const getUserBlogs = () => api.get('/blogs/my');
export const createBlog = (blogData) => api.post('/blogs', blogData);
export const updateBlog = (id, blogData) => api.put(`/blogs/${id}`, blogData);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);

export const getBlogById = (id) => api.get(`/blogs/${id}`);
export const getComments = (blogId) => api.get(`/blogs/${blogId}/comments`);
export const addComment = (blogId, commentData) => api.post(`/blogs/${blogId}/comments`, commentData);
export const getUserPublicBlogs = (username) => api.get(`/u/${username}`);


export default api;