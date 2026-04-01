import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/health")
      .then(res => setStatus(res.data.status))
      .catch(() => setStatus("error"));
  }, []);

  const isOk = status === "ok";

  return (
    <>
      {/* HERO / MAIN CARD */}
      <div className="card glow">
          <h1 style={{ marginBottom: "4px", fontSize: "1.3rem", fontWeight: "600" }}>
            Optimize Every Mile
          </h1>

          <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "10px" }}>
            Smarter routes. Faster deliveries. Better results.
          </p>  

        <p style={{ display: "flex", fontSize: "0.65rem", alignItems: "center", gap: "8px" }}>
          API Status:
          <span
            className={`status-badge ${isOk ? "success" : "error"}`}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            ● {status ? (isOk ? "Online" : "Online") : "Checking..."}
          </span>
        </p>
      </div>

      {/* FEATURES */}
      <div className="card glow">
        <h3 style={{ fontSize: "1rem" }}>✨ Features</h3>

        <ul className="feature-list">
          <li>📦 Manage and track orders</li>
          <li>🚚 Assign and monitor drivers</li>
          <li>🗺 Optimize delivery routes</li>
          <li>📊 Analyze efficiency improvements</li>
        </ul>
      </div>

      {/* QUICK ACTIONS */}
      <div className="card glow">
        <h3 style={{ fontSize: "1rem" }}>⚡ Quick Actions</h3>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
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
    </>
  );
}