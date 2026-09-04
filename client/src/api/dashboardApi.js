// ═══════════════════════════════════════════════════════
//  DASHBOARD API  —  Member 1 owns this file
// ═══════════════════════════════════════════════════════
import api from './axiosInstance';

export const getDashboardStats = () => api.get('/dashboard/stats');
export const getSalesSummary = () => api.get('/dashboard/summary');
export const getLowStock = () => api.get('/dashboard/low-stock');
export const getRecentInvoices = (limit = 5) =>
  api.get('/dashboard/recent-invoices', { params: { limit } });
