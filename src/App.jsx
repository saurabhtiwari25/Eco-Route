 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Drivers from "./pages/Drivers";
import RoutesPage from "./pages/Routes";
import DriverDashboard from "./pages/DriverDashboard";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Settings from "./pages/Settings";
import Help from "./pages/Help";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/drivers"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Drivers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver"
              element={
                <ProtectedRoute allowedRoles={["driver"]}>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/routes"
              element={
                <ProtectedRoute allowedRoles={["admin", "driver"]}>
                  <RoutesPage />
                </ProtectedRoute>
              }
            />

            // Add these routes inside your Routes component:
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={["admin", "driver"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute allowedRoles={["admin", "driver"]}>
                  <Help />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;