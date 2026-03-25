import api from "./api";

// CALL optimize API
export const optimizeRoutes = async () => {
  const res = await api.post("/optimize");
  return res.data;
};