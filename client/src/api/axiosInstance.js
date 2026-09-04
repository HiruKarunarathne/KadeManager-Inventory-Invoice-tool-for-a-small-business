// src/api/axiosInstance.js
// Shared Axios instance — attaches JWT from localStorage to every request.
// All API files in /api/ import from this instance.

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',   // proxied to http://localhost:5000/api by Vite
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — inject the Bearer token if available
api.interceptors.request.use(
  (config) => {
    // Support both localStorage key names (cross-member compatibility)
    const token = localStorage.getItem('kade_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — on 401, clear local auth and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('kade_token');
      localStorage.removeItem('kade_user');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
