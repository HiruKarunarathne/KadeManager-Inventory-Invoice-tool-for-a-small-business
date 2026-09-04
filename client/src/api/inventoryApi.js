// src/api/inventoryApi.js
// Inventory API calls — Member 2 extends this file as needed

import api from './axiosInstance';

export const getProducts = (params) => api.get('/inventory', { params });
export const getLowStockProducts = () => api.get('/inventory/low-stock');
export const getProductById = (id) => api.get(`/inventory/${id}`);
export const getProduct = getProductById; // alias
export const createProduct = (data) => api.post('/inventory', data);
export const updateProduct = (id, data) => api.put(`/inventory/${id}`, data);
export const deleteProduct = (id) => api.delete(`/inventory/${id}`);
