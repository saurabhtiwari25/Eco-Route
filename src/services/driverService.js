import { api } from './api';

export const driverService = {
  getAvailableDrivers: () => api.get('/drivers?status=available'),
  getAllDrivers: () => api.get('/drivers'),
  getDriverAssignments: (driverId) => api.get(`/driver/assignments?driverId=${driverId}`),
};