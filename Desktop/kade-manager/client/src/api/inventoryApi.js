import axiosInstance from './axiosInstance';

export const getProducts = async (params = {}) => {
  const response = await axiosInstance.get('/inventory', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/inventory/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axiosInstance.post('/inventory', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axiosInstance.put(`/inventory/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/inventory/${id}`);
  return response.data;
};
