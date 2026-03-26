import { api } from './api';

export const orderService = {
  createOrder: (orderData) => api.post('/admin/orders', orderData),
  getAllOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}`, { status }),
};