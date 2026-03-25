import { useEffect, useState } from "react";
import { getOrders, createOrder } from "../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [form, setForm] = useState({
    latitude: "",
    longitude: "",
    address: "",
  });

  // Fetch orders on load
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Create order
  const handleSubmit = async () => {
    try {
      await createOrder({
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        address: form.address,
      });

      setForm({ latitude: "", longitude: "", address: "" });

      fetchOrders(); // refresh list
    } catch (err) {
      console.error("Error creating order", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Create Order Form */}
      <div className="bg-white/10 p-4 rounded-xl mb-6">
        <h2 className="mb-2 font-semibold">Add Order</h2>

        <input
          name="latitude"
          placeholder="Latitude"
          value={form.latitude}
          onChange={handleChange}
          className="p-2 mr-2 rounded bg-white/20"
        />

        <input
          name="longitude"
          placeholder="Longitude"
          value={form.longitude}
          onChange={handleChange}
          className="p-2 mr-2 rounded bg-white/20"
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="p-2 mr-2 rounded bg-white/20"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white/10 p-3 rounded-lg"
          >
            <div><strong>ID:</strong> {order.id}</div>
            <div><strong>Address:</strong> {order.address}</div>
            <div><strong>Status:</strong> {order.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;