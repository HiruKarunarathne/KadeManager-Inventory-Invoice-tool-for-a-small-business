// ═══════════════════════════════════════════════════════
//  INVENTORY API  —  Member 2 owns this file
// ═══════════════════════════════════════════════════════
import api from './axiosInstance';

export const getProducts = (params) => api.get('/inventory', { params });
export const getProduct = (id) => api.get(`/inventory/${id}`);
export const createProduct = (data) => api.post('/inventory', data);
export const updateProduct = (id, data) => api.put(`/inventory/${id}`, data);
export const deleteProduct = (id) => api.delete(`/inventory/${id}`);
