// src/api/invoiceApi.js
// Invoice API calls for Kade Manager — Member 3 owns this module.
// Note: getProducts is imported directly from inventoryApi.js to avoid duplicate API logic.

import api from './axiosInstance';

export const createInvoice = (data) => api.post('/invoices', data);
export const getAllInvoices = (params) => api.get('/invoices', { params });
export const getInvoices = getAllInvoices; // alias
export const getInvoiceById = (id) => api.get(`/invoices/${id}`);
export const getInvoice = getInvoiceById; // alias
export const voidInvoice = (id) => api.patch(`/invoices/${id}/void`);
export const updateInvoiceCustomerName = (id, customerName) =>
  api.patch(`/invoices/${id}/customer`, { customerName });
