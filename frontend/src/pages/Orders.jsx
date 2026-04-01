import { useEffect, useState } from "react";
import api from "../api/axios";
import OrderForm from "../components/OrderForm";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const res = await api.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      {/* CREATE ORDER */}
      <div className="card">
        <h2>Create Order</h2>
        <OrderForm onCreated={load} />
      </div>

      {/* ORDERS LIST */}
      <div className="card">
        <h2>Orders</h2>

        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                <th>ID</th>
                <th>Location</th>
                <th>Priority</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td>{o._id.slice(-6)}</td>

                  <td>
                    {o.location[0]}, {o.location[1]}
                  </td>

                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        background:
                          o.priority === 1
                            ? "#dcfce7"
                            : o.priority === 2
                            ? "#fef9c3"
                            : "#fee2e2",
                      }}
                    >
                      {o.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}