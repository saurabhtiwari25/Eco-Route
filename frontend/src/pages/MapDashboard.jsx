import { useState } from "react";
import MapView from "../components/MapView";
import api from "../api/axios";

export default function MapDashboard() {
  const [showOrders, setShowOrders] = useState(true);
  const [showDrivers, setShowDrivers] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    try {
      setLoading(true);

      const ordersRes = await api.get("/orders");
      const driversRes = await api.get("/drivers");

      const res = await api.post("/optimize", {
        orders: ordersRes.data,
        drivers: driversRes.data,
      });

      // send routes to MapView via window event (simple + no refactor)
      window.dispatchEvent(
        new CustomEvent("routesUpdated", {
          detail: {
            routes: res.data.routes,
            drivers: driversRes.data,
          },
        })
      );
    } catch (err) {
      console.error("Optimization failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Route Optimization</h2>

      {/* CONTROLS */}
      <div className="map-controls">
        <button onClick={handleOptimize} disabled={loading}>
          {loading ? "Optimizing..." : "Run Optimization"}
        </button>

        <label>
          <input
            type="checkbox"
            checked={showOrders}
            onChange={() => setShowOrders(!showOrders)}
          />
          Orders
        </label>

        <label>
          <input
            type="checkbox"
            checked={showDrivers}
            onChange={() => setShowDrivers(!showDrivers)}
          />
          Drivers
        </label>

        <label>
          <input
            type="checkbox"
            checked={showRoutes}
            onChange={() => setShowRoutes(!showRoutes)}
          />
          Routes
        </label>
      </div>

      {/* MAP */}
      <div className="map-container">
        <MapView
          showOrders={showOrders}
          showDrivers={showDrivers}
          showRoutes={showRoutes}
        />
      </div>
    </div>
  );
}