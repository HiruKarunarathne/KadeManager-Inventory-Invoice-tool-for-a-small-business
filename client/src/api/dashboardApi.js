// src/api/dashboardApi.js
// Dashboard API calls — Member 1 extends this file as needed

import api from './axiosInstance';

export const getDashboardStats = () => api.get('/dashboard/stats');
export const getSharedStats = getDashboardStats; // alias
export const getSalesSummary = (period = 'month') =>
  api.get('/dashboard/summary', { params: { period } });
export const getLowStock = () => api.get('/dashboard/low-stock');
export const getRecentInvoices = (limit = 5) =>
  api.get('/dashboard/recent-invoices', { params: { limit } });
