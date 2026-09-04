// ═══════════════════════════════════════════════════════
//  INVOICE API  —  Member 3 owns this file
// ═══════════════════════════════════════════════════════
import api from './axiosInstance';

export const createInvoice = (data) => api.post('/invoices', data);
export const getInvoices = (params) => api.get('/invoices', { params });
export const getInvoice = (id) => api.get(`/invoices/${id}`);
