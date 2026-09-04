import axiosInstance from './axiosInstance';

export const createInvoice = async (invoiceData) => {
  const response = await axiosInstance.post('/invoices', invoiceData);
  return response.data;
};

export const getInvoices = async () => {
  const response = await axiosInstance.get('/invoices');
  return response.data;
};

export const getInvoiceById = async (id) => {
  const response = await axiosInstance.get(`/invoices/${id}`);
  return response.data;
};
