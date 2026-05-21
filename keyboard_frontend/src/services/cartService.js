import api from '../api/axios';

export const fetchCart = () => api.get('/cart');

export const addToCart = (productId, quantity = 1) =>
  api.post('/cart/add', { product_id: productId, quantity });

export const updateCartItemQuantity = (cartItemId, quantity) =>
  api.put(`/cart/items/${cartItemId}`, { quantity });

export const removeFromCart = (cartItemId) =>
  api.delete(`/cart/remove/${cartItemId}`);

export const clearCart = () => api.delete('/cart/clear');
