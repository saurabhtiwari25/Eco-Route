import api from "./api";

// GET all drivers
export const getDrivers = async () => {
  const res = await api.get("/drivers");
  return res.data;
};

// CREATE driver
export const createDriver = async (driver) => {
  const res = await api.post("/drivers", driver);
  return res.data;
};

// GET route for driver
export const getDriverRoute = async (driverId) => {
  const res = await api.get(`/drivers/${driverId}/route`);
  return res.data;
};