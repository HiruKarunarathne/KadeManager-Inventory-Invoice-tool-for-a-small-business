// src/api/authApi.js
// Auth API calls

import api from './axiosInstance';

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const registerStaff = register; // alias
export const getMe = () => api.get('/auth/me');
export const getAllUsers = () => api.get('/auth/users');
export const deleteUser = (id) => api.delete(`/auth/users/${id}`);
export const getStaff = () => api.get('/auth/staff');
export const deleteStaff = (id) => api.delete(`/auth/staff/${id}`);
