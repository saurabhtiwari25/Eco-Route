import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import MapView from "../components/MapView"; // ✅ FIX: import MapView

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const navigate = useNavigate(); // ✅ better navigation

  useEffect(() => {
    const load = async () => {
      try {
        const [o, d] = await Promise.all([
          api.get("/orders"),
          api.get("/drivers"),
        ]);

        setOrders(o.data);
        setDrivers(d.data);

        try {
          const a = await api.get("/assignments/latest");
          setAnalytics(a.data);
        } catch {
          setAnalytics(null);
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };

    load();
  }, []);

  return (
    <>
      <h1>Dashboard</h1>

      {/* KPI CARDS */}
      <div className="grid">
        <div className="card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>

        <div className="card">
          <h3>Total Drivers</h3>
          <p>{drivers.length}</p>
        </div>

        <div className="card">
          <h3>Recent Activity</h3>
          <ul className="activity">
            <li>📦 Order created (Priority 2)</li>
            <li>🚚 Driver added (Capacity 5)</li>
            <li>⚡ Optimization run completed</li>
          </ul>
        </div>

        <div className="card">
          <h3>Total Routes</h3>
          {/* better logic if analytics exists */}
          <p>{analytics?.routes_count || drivers.length}</p>
        </div>

        <div className="card">
          <h3>Efficiency</h3>
          <p>
            {analytics
              ? `${analytics.efficiency_gain}%`
              : "Run optimization"}
          </p>
        </div>
      </div>

      {/* MAP */}
      <div className="card">
        <h3>Live Map Preview</h3>
        <div style={{ height: "250px", width: "600px"  }}>
          <MapView />
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="card">
        <h3>Quick Actions</h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/orders")}>
            Create Order
          </button>

          <button onClick={() => navigate("/drivers")}>
            Add Driver
          </button>

          <button onClick={() => navigate("/map")}>
            Run Optimization
          </button>
        </div>
      </div>

      {/* INSIGHT SECTION */}
      <div className="card">
        <h3>System Insight</h3>

        {analytics ? (
          <>
            <p>Before Distance: {analytics.before_distance}</p>
            <p>After Distance: {analytics.after_distance}</p>
            <p>Efficiency Gain: {analytics.efficiency_gain}%</p>
          </>
        ) : (
          <p>No analytics yet. Run optimization to see results.</p>
        )}
      </div>
    </>
  );
}