import api from '../api/axios';

// ─── Admin Stats & Orders ──────────────────────────────────────────────────
export const fetchAdminStats = () => api.get('/admin/stats');

export const fetchAdminOrders = (params = {}) =>
  api.get('/admin/orders', { params });

export const updateOrderStatus = (orderId, status) =>
  api.patch(`/admin/orders/${orderId}/status`, { status });

// ─── Products ─────────────────────────────────────────────────────────────
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

// ─── Categories ────────────────────────────────────────────────────────────
export const fetchCategories = (params = {}) =>
  api.get('/categories', { params });

export const createCategory = (data) =>
  api.post('/categories', data);

export const updateCategory = (id, data) =>
  api.put(`/categories/${id}`, data);

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`);
