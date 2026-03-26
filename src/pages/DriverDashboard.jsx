import { useState, useEffect } from "react";
import GlassCard from "../components/common/GlassCard";
import { MapContainer, TileLayer, Marker, Polyline, Popup, Tooltip, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for driver dashboard
const currentLocationIcon = L.divIcon({
  className: 'current-location-icon',
  html: `<div style="
    width: 40px;
    height: 40px;
    background: #3b82f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    font-size: 20px;
    animation: pulse 1.5s infinite;
  ">🚗</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const pickupIcon = L.divIcon({
  html: `<div style="
    width: 28px;
    height: 28px;
    background: #22c55e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    font-size: 14px;
  ">📍</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const dropoffIcon = L.divIcon({
  html: `<div style="
    width: 28px;
    height: 28px;
    background: #ef4444;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    font-size: 14px;
  ">🏁</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const DriverDashboard = () => {
  const [driver, setDriver] = useState(null);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [countdown, setCountdown] = useState(null);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);
  const [mapZoom, setMapZoom] = useState(12);
  const [deliveryProgress, setDeliveryProgress] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // Mock data - In production, this would come from API based on logged-in driver
  useEffect(() => {
    // Simulate API call with driver data
    setTimeout(() => {
      const mockDriver = {
        id: "DRV-003",
        name: "David Rodriguez",
        email: "david.rodriguez@example.com",
        phone: "+1 234 567 8903",
        rating: 4.7,
        totalDeliveries: 98,
        completedToday: 3,
        status: "busy",
        currentLocation: { lat: 40.7489, lng: -73.9680, address: "789 Broadway, Brooklyn" },
        vehicleType: "Bicycle",
        vehiclePlate: "NYC-9012",
        joinedDate: "2024-03-10",
        performance: {
          onTimeRate: 94,
          customerRating: 4.7,
          totalEarnings: 2450.50,
          thisWeekEarnings: 450.75,
        }
      };

      const mockAssignedOrders = [
        {
          id: "ORD-002",
          customer: "Jane Smith",
          contactPhone: "+1 234 567 8902",
          pickupLocation: { lat: 40.7489, lng: -73.9680, address: "789 Broadway, Brooklyn" },
          dropoffLocation: { lat: 40.7829, lng: -73.9654, address: "890 3rd Ave, Queens" },
          quantity: 1,
          items: ["Documents"],
          specialRequest: "Need signature on delivery",
          status: "pending_pickup",
          priority: "normal",
          estimatedValue: 25.00,
          estimatedDeliveryTime: new Date(Date.now() + 3600000).toISOString(),
          distance: 4.2,
          eta: "25 min",
          createdAt: new Date().toISOString(),
        },
        {
          id: "ORD-005",
          customer: "Alice Johnson",
          contactPhone: "+1 234 567 8905",
          pickupLocation: { lat: 40.7829, lng: -73.9654, address: "890 3rd Ave, Queens" },
          dropoffLocation: { lat: 40.7128, lng: -74.0060, address: "123 Main St, Downtown" },
          quantity: 2,
          items: ["Package - Electronics"],
          specialRequest: "Handle with care, fragile",
          status: "assigned",
          priority: "high",
          estimatedValue: 89.99,
          estimatedDeliveryTime: new Date(Date.now() + 7200000).toISOString(),
          distance: 8.5,
          eta: "45 min",
          createdAt: new Date().toISOString(),
        },
      ];

      const mockRoute = {
        id: "RTE-001",
        driverId: "DRV-003",
        orders: mockAssignedOrders,
        totalDistance: 12.7,
        totalETA: "70 min",
        currentStop: 0,
        waypoints: [
          { lat: 40.7489, lng: -73.9680, type: "current", label: "Your Location", completed: false },
          { lat: 40.7489, lng: -73.9680, type: "pickup", label: "Pickup: ORD-002", orderId: "ORD-002", completed: false },
          { lat: 40.7829, lng: -73.9654, type: "dropoff", label: "Dropoff: ORD-002", orderId: "ORD-002", completed: false },
          { lat: 40.7829, lng: -73.9654, type: "pickup", label: "Pickup: ORD-005", orderId: "ORD-005", completed: false },
          { lat: 40.7128, lng: -74.0060, type: "dropoff", label: "Dropoff: ORD-005", orderId: "ORD-005", completed: false },
        ],
        path: [
          [40.7489, -73.9680],
          [40.7489, -73.9680],
          [40.7829, -73.9654],
          [40.7829, -73.9654],
          [40.7128, -74.0060],
        ]
      };

      setDriver(mockDriver);
      setAssignedOrders(mockAssignedOrders);
      setCurrentRoute(mockRoute);
      setLoading(false);

      // Add welcome notification
      addNotification("Welcome back! You have 2 deliveries scheduled for today.", "info");
    }, 1000);
  }, []);

  // Countdown timer for estimated delivery
  useEffect(() => {
    if (assignedOrders.length > 0) {
      const interval = setInterval(() => {
        const now = new Date();
        const nextOrder = assignedOrders.find(o => o.status !== "delivered");
        if (nextOrder?.estimatedDeliveryTime) {
          const deliveryTime = new Date(nextOrder.estimatedDeliveryTime);
          const diffSeconds = Math.max(0, Math.floor((deliveryTime - now) / 1000));
          const minutes = Math.floor(diffSeconds / 60);
          const seconds = diffSeconds % 60;
          setCountdown({ minutes, seconds, totalSeconds: diffSeconds });
          
          // Update progress
          if (currentRoute) {
            const completedStops = currentRoute.waypoints.filter(w => w.completed).length;
            const progress = (completedStops / currentRoute.waypoints.length) * 100;
            setDeliveryProgress(progress);
          }
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [assignedOrders, currentRoute]);

  const addNotification = (message, type = "info") => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 5));
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setAssignedOrders(orders =>
      orders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, completedAt: newStatus === "delivered" ? new Date().toISOString() : order.completedAt }
          : order
      )
    );

    // Update route progress
    if (currentRoute) {
      const updatedWaypoints = currentRoute.waypoints.map(w => {
        if (w.orderId === orderId && (newStatus === "picked_up" || newStatus === "delivered")) {
          return { ...w, completed: true };
        }
        return w;
      });
      setCurrentRoute({ ...currentRoute, waypoints: updatedWaypoints });
    }

    const statusMessages = {
      picked_up: "Order picked up successfully!",
      delivered: "Order delivered! Thank you for your service.",
      cancelled: "Order has been cancelled.",
    };
    
    addNotification(statusMessages[newStatus] || `Order status updated to ${newStatus}`, "success");
  };

  const handleStartDelivery = (orderId) => {
    handleUpdateStatus(orderId, "picked_up");
    setMapCenter([assignedOrders.find(o => o.id === orderId)?.pickupLocation.lat || 40.7128, 
                  assignedOrders.find(o => o.id === orderId)?.pickupLocation.lng || -74.0060]);
    setMapZoom(15);
    addNotification(`Starting delivery for order ${orderId}. Follow the route to destination.`, "info");
  };

  const handleCompleteDelivery = (orderId) => {
    handleUpdateStatus(orderId, "delivered");
    addNotification(`Order ${orderId} completed! Great job! 🎉`, "success");
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "pending_pickup": return { color: "bg-yellow-500/20 text-yellow-400", text: "Ready for Pickup" };
      case "picked_up": return { color: "bg-blue-500/20 text-blue-400", text: "In Transit" };
      case "delivered": return { color: "bg-green-500/20 text-green-400", text: "Delivered ✓" };
      case "assigned": return { color: "bg-purple-500/20 text-purple-400", text: "Assigned" };
      default: return { color: "bg-gray-500/20 text-gray-400", text: status };
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case "urgent": return "bg-red-500/20 text-red-400";
      case "high": return "bg-orange-500/20 text-orange-400";
      default: return "bg-blue-500/20 text-blue-400";
    }
  };

  const filteredOrders = assignedOrders.filter(order => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    return true;
  });

  const pendingPickup = assignedOrders.filter(o => o.status === "pending_pickup" || o.status === "assigned").length;
  const inTransit = assignedOrders.filter(o => o.status === "picked_up").length;
  const completed = assignedOrders.filter(o => o.status === "delivered").length;
  const totalEarnings = assignedOrders.reduce((sum, o) => sum + (o.status === "delivered" ? (o.estimatedValue || 0) : 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-white text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Driver Info */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Deliveries</h1>
          <p className="text-gray-400 mt-1">Welcome back, {driver?.name}!</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Today's Earnings</div>
          <div className="text-2xl font-bold text-green-400">${driver?.performance?.thisWeekEarnings || 0}</div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-3 rounded-lg shadow-lg backdrop-blur-md animate-slide-in ${
                notif.type === "success" ? "bg-green-500/90" :
                notif.type === "warning" ? "bg-yellow-500/90" :
                "bg-blue-500/90"
              } text-white text-sm max-w-sm`}
            >
              {notif.message}
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Pending Pickup</p>
              <p className="text-2xl font-bold mt-1 text-yellow-400">{pendingPickup}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-yellow-400">📦</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">In Transit</p>
              <p className="text-2xl font-bold mt-1 text-blue-400">{inTransit}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400">🚚</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Completed Today</p>
              <p className="text-2xl font-bold mt-1 text-green-400">{completed}</p>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400">✅</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Driver Rating</p>
              <p className="text-2xl font-bold mt-1">{driver?.rating}⭐</p>
            </div>
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-purple-400">⭐</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Delivery Progress */}
      {currentRoute && deliveryProgress > 0 && deliveryProgress < 100 && (
        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Today's Delivery Progress</h3>
            <span className="text-sm text-gray-400">{Math.round(deliveryProgress)}% Complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${deliveryProgress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>📍 Pickup</span>
            <span>🚚 In Transit</span>
            <span>🏁 Delivery</span>
          </div>
        </GlassCard>
      )}

      {/* Live Map View */}
      {showMap && (
        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">🗺️ Live Route Tracking</h2>
            <button
              onClick={() => setShowMap(false)}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Hide Map
            </button>
          </div>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              
              {/* Draw route */}
              {currentRoute && (
                <Polyline
                  positions={currentRoute.path}
                  color="#3b82f6"
                  weight={4}
                  opacity={0.8}
                  dashArray="5, 10"
                />
              )}
              
              {/* Driver current location */}
              {driver && (
                <Marker
                  position={[driver.currentLocation.lat, driver.currentLocation.lng]}
                  icon={currentLocationIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>Your Location</strong><br />
                      {driver.currentLocation.address}<br />
                      Speed: 25 km/h
                    </div>
                  </Popup>
                  <Tooltip permanent>You are here</Tooltip>
                </Marker>
              )}
              
              {/* Route waypoints */}
              {currentRoute?.waypoints.map((wp, idx) => {
                if (wp.type === "pickup") {
                  return (
                    <Marker key={idx} position={[wp.lat, wp.lng]} icon={pickupIcon}>
                      <Popup>{wp.label}{wp.completed ? " ✓ Completed" : ""}</Popup>
                      <Tooltip>{wp.label}</Tooltip>
                    </Marker>
                  );
                } else if (wp.type === "dropoff") {
                  return (
                    <Marker key={idx} position={[wp.lat, wp.lng]} icon={dropoffIcon}>
                      <Popup>{wp.label}{wp.completed ? " ✓ Completed" : ""}</Popup>
                      <Tooltip>{wp.label}</Tooltip>
                    </Marker>
                  );
                }
                return null;
              })}
            </MapContainer>
          </div>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Pickup Point</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Dropoff Point</span>
            </div>
          </div>
        </GlassCard>
      )}

      {!showMap && (
        <button
          onClick={() => setShowMap(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition w-full"
        >
          Show Live Map
        </button>
      )}

      {/* Filter Controls */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg transition ${statusFilter === "all" ? "bg-blue-500 text-white" : "bg-white/10 hover:bg-white/20"}`}
            >
              All ({assignedOrders.length})
            </button>
            <button
              onClick={() => setStatusFilter("pending_pickup")}
              className={`px-4 py-2 rounded-lg transition ${statusFilter === "pending_pickup" ? "bg-yellow-500 text-white" : "bg-white/10 hover:bg-white/20"}`}
            >
              Ready for Pickup ({pendingPickup})
            </button>
            <button
              onClick={() => setStatusFilter("picked_up")}
              className={`px-4 py-2 rounded-lg transition ${statusFilter === "picked_up" ? "bg-blue-500 text-white" : "bg-white/10 hover:bg-white/20"}`}
            >
              In Transit ({inTransit})
            </button>
            <button
              onClick={() => setStatusFilter("delivered")}
              className={`px-4 py-2 rounded-lg transition ${statusFilter === "delivered" ? "bg-green-500 text-white" : "bg-white/10 hover:bg-white/20"}`}
            >
              Completed ({completed})
            </button>
          </div>
          
          {countdown && countdown.totalSeconds > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-400">Next Delivery ETA</p>
              <p className="text-xl font-mono text-yellow-400">
                {countdown.minutes}:{countdown.seconds.toString().padStart(2, '0')}
              </p>
            </div>
          )}
        </div>

        {/* Orders List */}
        <h2 className="text-xl font-semibold mb-4">
          Your Deliveries ({filteredOrders.length})
        </h2>
        
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusBadge = getStatusBadge(order.status);
            return (
              <div
                key={order.id}
                className={`bg-white/5 rounded-lg p-4 hover:bg-white/10 transition cursor-pointer ${
                  selectedOrder?.id === order.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityBadge(order.priority)}`}>
                        {order.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-1">{order.customer}</p>
                    <p className="text-sm text-gray-400">{order.contactPhone}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm">
                      <div>
                        <p className="text-gray-500">Pickup</p>
                        <p className="text-xs">{order.pickupLocation.address}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Dropoff</p>
                        <p className="text-xs">{order.dropoffLocation.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span>📦 Qty: {order.quantity}</span>
                      <span>💰 ${order.estimatedValue?.toFixed(2)}</span>
                      <span>⏱️ ETA: {order.eta}</span>
                      <span>📏 {order.distance} km</span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <div>Priority: {order.priority}</div>
                    <div>Created: {new Date(order.createdAt).toLocaleTimeString()}</div>
                  </div>
                </div>
                
                {/* Expanded Order Details */}
                {selectedOrder?.id === order.id && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    {order.specialRequest && (
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm">Special Instructions</p>
                        <p className="text-sm bg-yellow-500/10 p-2 rounded border border-yellow-500/30">
                          📝 {order.specialRequest}
                        </p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-sm">Items to Deliver</p>
                        <ul className="text-sm mt-1">
                          {order.items?.map((item, idx) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Delivery Details</p>
                        <p className="text-sm">Distance: {order.distance} km</p>
                        <p className="text-sm">Estimated Time: {order.eta}</p>
                        {order.estimatedDeliveryTime && (
                          <p className="text-sm text-blue-400">
                            Expected by: {new Date(order.estimatedDeliveryTime).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {order.status === "assigned" && (
                        <button
                          onClick={() => handleStartDelivery(order.id)}
                          className="bg-green-500/20 text-green-400 px-4 py-2 rounded text-sm hover:bg-green-500/30 transition"
                        >
                          Start Delivery (Pickup)
                        </button>
                      )}
                      {order.status === "picked_up" && (
                        <button
                          onClick={() => handleCompleteDelivery(order.id)}
                          className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded text-sm hover:bg-blue-500/30 transition"
                        >
                          Complete Delivery
                        </button>
                      )}
                      {(order.status === "pending_pickup" || order.status === "assigned") && (
                        <button
                          onClick={() => {
                            setMapCenter([order.pickupLocation.lat, order.pickupLocation.lng]);
                            setMapZoom(15);
                            addNotification(`Navigating to pickup location for order ${order.id}`, "info");
                          }}
                          className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded text-sm hover:bg-purple-500/30 transition"
                        >
                          Navigate to Pickup
                        </button>
                      )}
                      {order.status === "picked_up" && (
                        <button
                          onClick={() => {
                            setMapCenter([order.dropoffLocation.lat, order.dropoffLocation.lng]);
                            setMapZoom(15);
                            addNotification(`Navigating to delivery location for order ${order.id}`, "info");
                          }}
                          className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded text-sm hover:bg-orange-500/30 transition"
                        >
                          Navigate to Dropoff
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredOrders.length === 0 && (
            <p className="text-gray-400 text-center py-8">
              No deliveries found. Check back later for new assignments!
            </p>
          )}
        </div>
      </GlassCard>

      {/* Driver Stats & Performance */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold mb-4">📊 Your Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Total Deliveries</p>
            <p className="text-2xl font-bold">{driver?.totalDeliveries}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">On-Time Rate</p>
            <p className="text-2xl font-bold text-green-400">{driver?.performance?.onTimeRate}%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Customer Rating</p>
            <p className="text-2xl font-bold text-yellow-400">{driver?.performance?.customerRating}⭐</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Total Earnings</p>
            <p className="text-2xl font-bold text-blue-400">${driver?.performance?.totalEarnings}</p>
          </div>
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => {
            setStatusFilter("pending_pickup");
            addNotification("Showing orders ready for pickup", "info");
          }}
          className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition text-center"
        >
          <div className="text-2xl mb-2">📦</div>
          <div className="font-semibold">Ready for Pickup</div>
          <div className="text-sm text-gray-400">{pendingPickup} orders waiting</div>
        </button>
        
        <button
          onClick={() => {
            setShowMap(true);
            addNotification("Opening live tracking map", "info");
          }}
          className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition text-center"
        >
          <div className="text-2xl mb-2">🗺️</div>
          <div className="font-semibold">Live Tracking</div>
          <div className="text-sm text-gray-400">View your route</div>
        </button>
        
        <button
          onClick={() => {
            window.location.reload();
          }}
          className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition text-center"
        >
          <div className="text-2xl mb-2">🔄</div>
          <div className="font-semibold">Refresh</div>
          <div className="text-sm text-gray-400">Update status</div>
        </button>
      </div>
    </div>
  );
};

export default DriverDashboard;