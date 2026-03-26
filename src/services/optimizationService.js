import { api } from './api';

export const optimizationService = {
  triggerOptimization: () => api.post('/admin/optimize'),
  getOptimizedRoutes: () => api.get('/admin/routes'),
  getRouteStatus: (routeId) => api.get(`/admin/routes/${routeId}`),
};