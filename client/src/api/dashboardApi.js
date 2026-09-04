// src/api/dashboardApi.js
// Dashboard API calls — Member 1 extends this file as needed

import api from './axiosInstance';

export const getSharedStats = () => api.get('/dashboard/stats');
export const getSalesSummary = (period = 'month') =>
  api.get('/dashboard/sales', { params: { period } });
