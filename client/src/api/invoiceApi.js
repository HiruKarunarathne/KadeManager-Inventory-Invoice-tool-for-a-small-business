// src/api/invoiceApi.js
// Invoice API calls — Member 3 extends this file as needed

import api from './axiosInstance';

export const createInvoice = (data) => api.post('/invoices', data);
export const getAllInvoices = () => api.get('/invoices');
export const getInvoiceById = (id) => api.get(`/invoices/${id}`);
