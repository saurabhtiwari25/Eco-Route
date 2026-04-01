import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import "../styles/global.css";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // adjust if using different key
    navigate("/login");
  };

  return (
    <div className="app">
      <Sidebar />

      <div className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <h2
              style={{
                color: "#2b2545",
                textShadow: "0 0 6px rgba(120, 90, 255, 0.3), 0 0 12px rgba(120, 90, 255, 0.2)",
                fontWeight: 600,
                letterSpacing: "0.5px"
              }}
            >
              Eco Route
          </h2>

          <div className="topbar-right">
            <span className="profile">👤 Admin</span>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}