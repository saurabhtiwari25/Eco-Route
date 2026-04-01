import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>🚚 Eco Route</h2>

      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/orders">Orders</NavLink>
        <NavLink to="/drivers">Drivers</NavLink>
        <NavLink to="/map">Map</NavLink>
        <NavLink to="/analytics">Analytics</NavLink>
      </nav>
    </div>
  );
}