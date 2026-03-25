import { useEffect, useState } from "react";
import GlassCard from "../components/common/GlassCard";
import { getOrders } from "../services/orderService";
import { getDrivers } from "../services/driverService";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    orders: 0,
    drivers: 0,
    assignments: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const orders = await getOrders();
      const drivers = await getDrivers();

      const assignmentsRes = await api.get("/assignments");

      setStats({
        orders: orders.length,
        drivers: drivers.length,
        assignments: assignmentsRes.data.length,
      });

    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">
        
        <GlassCard>
          <h2 className="text-sm text-gray-400">Total Orders</h2>
          <p className="text-3xl font-semibold mt-2">
            {stats.orders}
          </p>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm text-gray-400">Total Drivers</h2>
          <p className="text-3xl font-semibold mt-2">
            {stats.drivers}
          </p>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm text-gray-400">
            Routes Optimized
          </h2>
          <p className="text-3xl font-semibold mt-2">
            {stats.assignments}
          </p>
        </GlassCard>

      </div>
    </div>
  );
};

export default Dashboard;