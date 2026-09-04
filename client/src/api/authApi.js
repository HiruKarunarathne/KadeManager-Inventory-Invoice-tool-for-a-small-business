import api from './axiosInstance';

export const login = (credentials) => api.post('/auth/login', credentials);
export const getMe = () => api.get('/auth/me');
export const registerStaff = (data) => api.post('/auth/register', data);
export const getStaff = () => api.get('/auth/staff');
export const deleteStaff = (id) => api.delete(`/auth/staff/${id}`);
