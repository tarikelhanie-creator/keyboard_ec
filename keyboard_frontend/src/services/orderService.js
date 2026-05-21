import api from '../api/axios';

export const submitOrder = (orderPayload) => api.post('/orders', orderPayload);
