import api from '../api/axios';

export const fetchAdminStats = () => api.get('/admin/stats');

export const fetchAdminOrders = (params = {}) =>
  api.get('/admin/orders', { params });

export const updateOrderStatus = (orderId, status) =>
  api.patch(`/admin/orders/${orderId}/status`, { status });

export const fetchProducts = (params = {}) =>
  api.get('/products', { params });

export const createProduct = (formData) =>
  api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateProduct = (id, formData) => {
  formData.append('_method', 'PUT');
  return api.post(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const fetchCategories = () => api.get('/categories');
