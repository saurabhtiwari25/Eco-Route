 import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Drivers from "./pages/Drivers";
import MapDashboard from "./pages/MapDashboard";
import Analytics from "./pages/Analytics";

import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Layout wrapper */}
      <Route element={<Layout />}>

        {/* Public routes (no protection) */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/map" element={<MapDashboard />} />
        <Route path="/analytics" element={<Analytics />} />

      </Route>

      {/* Optional: keep or remove */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Redirect */}
      <Route path="/home" element={<Navigate to="/" />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}