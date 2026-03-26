 import { useState, useEffect } from "react";
import GlassCard from "../components/common/GlassCard";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Mock data - In production, this would come from your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders([
        {
          id: "ORD-001",
          customer: "John Doe",
          pickupLocation: "Downtown",
          dropoffLocation: "Uptown",
          status: "pending",
          createdAt: new Date().toISOString(),
          driverId: null,
        },
        {
          id: "ORD-002",
          customer: "Jane Smith",
          pickupLocation: "Northside",
          dropoffLocation: "Southside",
          status: "assigned",
          createdAt: new Date().toISOString(),
          driverId: "DRV-001",
        },
        {
          id: "ORD-003",
          customer: "Bob Johnson",
          pickupLocation: "Eastside",
          dropoffLocation: "Westside",
          status: "delivered",
          createdAt: new Date().toISOString(),
          driverId: "DRV-002",
          completedAt: new Date().toISOString(),
        },
      ]);

      setDrivers([
        {
          id: "DRV-001",
          name: "Michael Chen",
          email: "michael@example.com",
          phone: "+1 234 567 8901",
          rating: 4.8,
          totalDeliveries: 156,
          completedToday: 5,
          status: "available",
          currentLocation: { lat: 40.7128, lng: -74.0060 },
          joinedDate: "2024-01-15",
        },
        {
          id: "DRV-002",
          name: "Sarah Williams",
          email: "sarah@example.com",
          phone: "+1 234 567 8902",
          rating: 4.9,
          totalDeliveries: 203,
          completedToday: 7,
          status: "busy",
          currentLocation: { lat: 40.7580, lng: -73.9855 },
          joinedDate: "2024-02-20",
        },
        {
          id: "DRV-003",
          name: "David Rodriguez",
          email: "david@example.com",
          phone: "+1 234 567 8903",
          rating: 4.7,
          totalDeliveries: 98,
          completedToday: 3,
          status: "available",
          currentLocation: { lat: 40.7489, lng: -73.9680 },
          joinedDate: "2024-03-10",
        },
        {
          id: "DRV-004",
          name: "Emily Brown",
          email: "emily@example.com",
          phone: "+1 234 567 8904",
          rating: 5.0,
          totalDeliveries: 312,
          completedToday: 8,
          status: "available",
          currentLocation: { lat: 40.7829, lng: -73.9654 },
          joinedDate: "2023-11-05",
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const assignedOrders = orders.filter(o => o.status === "assigned").length;
  const deliveredOrders = orders.filter(o => o.status === "delivered").length;
  const totalDeliveries = drivers.reduce((sum, driver) => sum + driver.totalDeliveries, 0);
  const averageRating = (drivers.reduce((sum, driver) => sum + driver.rating, 0) / drivers.length).toFixed(1);
  const availableDrivers = drivers.filter(d => d.status === "available").length;

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "assigned": return "bg-blue-500/20 text-blue-400";
      case "delivered": return "bg-green-500/20 text-green-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push("⭐");
    }
    if (hasHalfStar) {
      stars.push("½");
    }
    return stars.join("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-white text-xl">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 hover:scale-105 transition-transform">
          <h3 className="text-gray-400 text-sm">Total Orders</h3>
          <p className="text-3xl font-bold mt-2">{orders.length}</p>
          <div className="flex justify-between mt-2 text-xs">
            <span className="text-yellow-400">Pending: {pendingOrders}</span>
            <span className="text-blue-400">Assigned: {assignedOrders}</span>
            <span className="text-green-400">Delivered: {deliveredOrders}</span>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6 hover:scale-105 transition-transform">
          <h3 className="text-gray-400 text-sm">Active Drivers</h3>
          <p className="text-3xl font-bold mt-2">{availableDrivers}</p>
          <p className="text-xs text-gray-500 mt-2">Total: {drivers.length} drivers</p>
        </GlassCard>
        
        <GlassCard className="p-6 hover:scale-105 transition-transform">
          <h3 className="text-gray-400 text-sm">Total Deliveries</h3>
          <p className="text-3xl font-bold mt-2">{totalDeliveries}</p>
          <p className="text-xs text-gray-500 mt-2">All time deliveries</p>
        </GlassCard>
        
        <GlassCard className="p-6 hover:scale-105 transition-transform">
          <h3 className="text-gray-400 text-sm">Average Driver Rating</h3>
          <p className="text-3xl font-bold mt-2">{averageRating}</p>
          <p className="text-xs text-gray-500 mt-2">⭐ {averageRating} out of 5</p>
        </GlassCard>
      </div>

      {/* Current Orders Section */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Current Orders</h2>
          <button className="text-sm text-blue-400 hover:text-blue-300 transition">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-2 text-gray-400">Order ID</th>
                <th className="text-left py-3 px-2 text-gray-400">Customer</th>
                <th className="text-left py-3 px-2 text-gray-400">From → To</th>
                <th className="text-left py-3 px-2 text-gray-400">Status</th>
                <th className="text-left py-3 px-2 text-gray-400">Driver</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-2 font-mono text-sm">{order.id}</td>
                  <td className="py-3 px-2">{order.customer}</td>
                  <td className="py-3 px-2 text-sm">
                    {order.pickupLocation} → {order.dropoffLocation}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-sm">
                    {order.driverId ? drivers.find(d => d.id === order.driverId)?.name || "Assigned" : "Unassigned"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center text-gray-400 py-8">No orders found</p>
          )}
        </div>
      </GlassCard>

      {/* Drivers Section with Ratings */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Drivers Performance</h2>
          <button className="text-sm text-blue-400 hover:text-blue-300 transition">
            Manage Drivers →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition cursor-pointer"
              onClick={() => setSelectedDriver(selectedDriver?.id === driver.id ? null : driver)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{driver.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      driver.status === "available" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {driver.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-400">{getStarRating(driver.rating)}</span>
                    <span className="text-sm text-gray-400">({driver.rating})</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div>
                      <p className="text-gray-500">Total Deliveries</p>
                      <p className="font-semibold">{driver.totalDeliveries}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Today's Deliveries</p>
                      <p className="font-semibold text-green-400">{driver.completedToday}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="text-sm">{new Date(driver.joinedDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Expanded Details */}
              {selectedDriver?.id === driver.id && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="text-gray-300">{driver.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="text-gray-300">{driver.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Current Location</p>
                      <p className="text-gray-300 text-xs font-mono">
                        {driver.currentLocation.lat}, {driver.currentLocation.lng}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-sm hover:bg-blue-500/30 transition">
                      View Route
                    </button>
                    <button className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm hover:bg-green-500/30 transition">
                      Assign Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Recent Activity */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {orders.slice(0, 3).map((order) => (
            <div key={order.id} className="flex items-center gap-3 text-sm border-b border-white/5 pb-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-400">
                {order.status === "delivered" 
                  ? `Order ${order.id} was delivered successfully`
                  : order.status === "assigned"
                  ? `Order ${order.id} assigned to ${drivers.find(d => d.id === order.driverId)?.name || "driver"}`
                  : `Order ${order.id} created for ${order.customer}`
                }
              </span>
              <span className="text-xs text-gray-500 ml-auto">
                {new Date(order.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-gray-400 text-center py-4">No recent activity to display.</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard;