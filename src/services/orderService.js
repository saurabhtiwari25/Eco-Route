import api from "./api";

// GET all orders
export const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

// CREATE order
export const createOrder = async (order) => {
  const res = await api.post("/orders", order);
  return res.data;
};