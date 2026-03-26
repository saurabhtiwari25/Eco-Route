import { useState, useEffect } from "react";
import GlassCard from "../components/common/GlassCard";
import { MapContainer, TileLayer, Marker, Polyline, Popup, CircleMarker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const driverIcon = (color) => {
  return L.divIcon({
    className: 'custom-driver-icon',
    html: `<div style="
      width: 32px;
      height: 32px;
      background: ${color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      font-size: 16px;
    ">🚗</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const pickupIcon = L.divIcon({
  className: 'pickup-icon',
  html: `<div style="
    width: 28px;
    height: 28px;
    background: #3b82f6;
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
  className: 'dropoff-icon',
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

const RoutesPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [optimizationType, setOptimizationType] = useState("distance");
  const [optimizing, setOptimizing] = useState(false);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);
  const [mapZoom, setMapZoom] = useState(12);

  useEffect(() => {
    // Mock data - expanded with more details
    const mockDrivers = [
      { 
        id: "DRV-001", 
        name: "Michael Chen", 
        status: "available", 
        rating: 4.8,
        totalDeliveries: 156,
        location: { lat: 40.7128, lng: -74.0060, address: "123 Main St, Downtown" },
        vehicleType: "Motorcycle"
      },
      { 
        id: "DRV-002", 
        name: "Sarah Williams", 
        status: "available", 
        rating: 4.9,
        totalDeliveries: 203,
        location: { lat: 40.7580, lng: -73.9855, address: "456 Park Ave, Midtown" },
        vehicleType: "Car"
      },
      { 
        id: "DRV-003", 
        name: "David Rodriguez", 
        status: "available", 
        rating: 4.7,
        totalDeliveries: 98,
        location: { lat: 40.7489, lng: -73.9680, address: "789 Broadway, Brooklyn" },
        vehicleType: "Bicycle"
      },
      { 
        id: "DRV-004", 
        name: "Emily Brown", 
        status: "busy", 
        rating: 5.0,
        totalDeliveries: 312,
        location: { lat: 40.7829, lng: -73.9654, address: "890 3rd Ave, Queens" },
        vehicleType: "Car"
      },
    ];

    const mockOrders = [
      {
        id: "ORD-001",
        customer: "John Doe",
        pickup: { lat: 40.7128, lng: -74.0060, address: "123 Main St, Downtown" },
        dropoff: { lat: 40.7580, lng: -73.9855, address: "456 Park Ave, Uptown" },
        status: "pending",
        priority: "high",
        quantity: 2,
        estimatedValue: 45.50,
      },
      {
        id: "ORD-002",
        customer: "Jane Smith",
        pickup: { lat: 40.7489, lng: -73.9680, address: "789 Broadway, Brooklyn" },
        dropoff: { lat: 40.7829, lng: -73.9654, address: "890 3rd Ave, Queens" },
        status: "pending",
        priority: "normal",
        quantity: 1,
        estimatedValue: 25.00,
      },
      {
        id: "ORD-003",
        customer: "Bob Johnson",
        pickup: { lat: 40.7580, lng: -73.9855, address: "456 Park Ave, Midtown" },
        dropoff: { lat: 40.7128, lng: -74.0060, address: "123 Main St, Downtown" },
        status: "pending",
        priority: "urgent",
        quantity: 3,
        estimatedValue: 89.99,
      },
      {
        id: "ORD-004",
        customer: "Alice Brown",
        pickup: { lat: 40.7829, lng: -73.9654, address: "890 3rd Ave, Queens" },
        dropoff: { lat: 40.7489, lng: -73.9680, address: "789 Broadway, Brooklyn" },
        status: "pending",
        priority: "normal",
        quantity: 1,
        estimatedValue: 15.75,
      },
    ];

    setDrivers(mockDrivers);
    setOrders(mockOrders);
  }, []);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calculate estimated time based on distance and speed
  const calculateETA = (distance, avgSpeed = 30) => {
    const timeHours = distance / avgSpeed;
    const minutes = Math.round(timeHours * 60);
    if (minutes < 60) return `${minutes} min`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  // Advanced route optimization algorithm
  const optimizeRoutes = () => {
    setOptimizing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const availableDrivers = drivers.filter(d => d.status === "available");
      const pendingOrders = orders.filter(o => o.status === "pending");
      
      if (availableDrivers.length === 0 || pendingOrders.length === 0) {
        alert("No available drivers or pending orders to optimize");
        setOptimizing(false);
        return;
      }

      let optimizedRoutes = [];
      let unassignedOrders = [...pendingOrders];
      let assignedDrivers = [...availableDrivers];

      // Sort orders by priority (urgent first, then high, then normal)
      const priorityOrder = { urgent: 0, high: 1, normal: 2 };
      unassignedOrders.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      // For each driver, find the best matching orders
      assignedDrivers.forEach(driver => {
        if (unassignedOrders.length === 0) return;

        // Calculate scores for all unassigned orders
        const scoredOrders = unassignedOrders.map(order => {
          // Distance from driver to pickup
          const distToPickup = calculateDistance(
            driver.location.lat, driver.location.lng,
            order.pickup.lat, order.pickup.lng
          );
          
          // Distance from pickup to dropoff
          const routeDistance = calculateDistance(
            order.pickup.lat, order.pickup.lng,
            order.dropoff.lat, order.dropoff.lng
          );
          
          // Priority bonus
          const priorityBonus = priorityOrder[order.priority] === 0 ? 50 :
                               priorityOrder[order.priority] === 1 ? 30 : 10;
          
          // Score based on optimization type
          let score;
          if (optimizationType === "distance") {
            // Prefer shorter distances
            score = (100 - Math.min(distToPickup * 20, 100)) + priorityBonus;
          } else if (optimizationType === "time") {
            // Prefer faster routes
            const timeToPickup = distToPickup / 30 * 60; // minutes
            const timeToDrop = routeDistance / 30 * 60;
            score = (100 - Math.min(timeToPickup, 100)) + priorityBonus;
          } else {
            // Balanced (default)
            score = (100 - Math.min(distToPickup * 15, 100)) + priorityBonus;
          }
          
          return { order, score, distToPickup, routeDistance };
        });
        
        // Sort by score and take best order
        scoredOrders.sort((a, b) => b.score - a.score);
        
        if (scoredOrders.length > 0) {
          const best = scoredOrders[0];
          const eta = calculateETA(best.distToPickup + best.routeDistance);
          
          // Create route with waypoints for better visualization
          const waypoints = [
            { lat: driver.location.lat, lng: driver.location.lng, type: "driver", label: driver.name },
            { lat: best.order.pickup.lat, lng: best.order.pickup.lng, type: "pickup", label: `Pickup: ${best.order.id}` },
            { lat: best.order.dropoff.lat, lng: best.order.dropoff.lng, type: "dropoff", label: `Dropoff: ${best.order.id}` }
          ];
          
          optimizedRoutes.push({
            id: `RTE-${optimizedRoutes.length + 1}`,
            driverId: driver.id,
            driverName: driver.name,
            orderId: best.order.id,
            customer: best.order.customer,
            priority: best.order.priority,
            distance: (best.distToPickup + best.routeDistance).toFixed(2),
            eta: eta,
            score: Math.round(best.score),
            waypoints: waypoints,
            path: [
              [driver.location.lat, driver.location.lng],
              [best.order.pickup.lat, best.order.pickup.lng],
              [best.order.dropoff.lat, best.order.dropoff.lng]
            ],
            optimizationScore: Math.round(best.score)
          });
          
          // Remove assigned order from unassigned list
          unassignedOrders = unassignedOrders.filter(o => o.id !== best.order.id);
        }
      });

      setRoutes(optimizedRoutes);
      setOptimizing(false);
      
      // Show summary
      const totalDistance = optimizedRoutes.reduce((sum, r) => sum + parseFloat(r.distance), 0);
      alert(`✅ Optimization complete!\n\n📊 Summary:\n- ${optimizedRoutes.length} routes created\n- Total distance: ${totalDistance.toFixed(2)} km\n- Average match score: ${Math.round(optimizedRoutes.reduce((sum, r) => sum + r.optimizationScore, 0) / optimizedRoutes.length)}%\n- ${unassignedOrders.length} orders remaining`);
      
    }, 1500);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "urgent": return "bg-red-500/20 text-red-400";
      case "high": return "bg-orange-500/20 text-orange-400";
      default: return "bg-blue-500/20 text-blue-400";
    }
  };

  const getRouteColor = (score) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#3b82f6";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const availableDrivers = drivers.filter(d => d.status === "available").length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const totalDistance = routes.reduce((sum, r) => sum + parseFloat(r.distance), 0);
  const avgScore = routes.length > 0 ? Math.round(routes.reduce((sum, r) => sum + r.optimizationScore, 0) / routes.length) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Optimized Routes</h1>
        <div className="text-sm text-gray-400">
          {routes.length} active routes | {totalDistance.toFixed(1)} km total
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Available Drivers</p>
              <p className="text-2xl font-bold mt-1 text-green-400">{availableDrivers}</p>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400">🚗</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Pending Orders</p>
              <p className="text-2xl font-bold mt-1 text-yellow-400">{pendingOrders}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-yellow-400">📦</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Routes Created</p>
              <p className="text-2xl font-bold mt-1 text-blue-400">{routes.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400">🛣️</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Optimization Score</p>
              <p className="text-2xl font-bold mt-1 text-purple-400">{avgScore}%</p>
            </div>
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-purple-400">🎯</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Optimization Controls */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Optimization Strategy
              </label>
              <select
                value={optimizationType}
                onChange={(e) => setOptimizationType(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="distance">Minimize Distance</option>
                <option value="time">Minimize Time</option>
                <option value="balanced">Balanced</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={optimizeRoutes}
            disabled={optimizing || availableDrivers === 0 || pendingOrders === 0}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              optimizing || availableDrivers === 0 || pendingOrders === 0
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
            } text-white`}
          >
            {optimizing ? "Optimizing..." : "🚀 Optimize Routes"}
          </button>
        </div>
        
        {availableDrivers === 0 && (
          <p className="text-yellow-400 text-sm mt-4">⚠️ No available drivers. Please wait for drivers to become available.</p>
        )}
        {pendingOrders === 0 && availableDrivers > 0 && (
          <p className="text-yellow-400 text-sm mt-4">⚠️ No pending orders. Create orders to optimize routes.</p>
        )}
      </GlassCard>

      {/* Map View */}
      <GlassCard className="p-4">
        <h2 className="text-xl font-semibold mb-4">🗺️ Route Visualization</h2>
        <div className="h-[500px] rounded-lg overflow-hidden">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Draw all routes */}
            {routes.map((route, index) => (
              <Polyline 
                key={`route-${index}`} 
                positions={route.path} 
                color={getRouteColor(route.optimizationScore)}
                weight={4}
                opacity={0.8}
                dashArray={selectedRoute?.id === route.id ? "0" : "5, 10"}
              />
            ))}

            {/* Driver markers */}
            {drivers.filter(d => d.status === "available").map(driver => (
              <Marker
                key={`driver-${driver.id}`}
                position={[driver.location.lat, driver.location.lng]}
                icon={driverIcon("#22c55e")}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{driver.name}</strong><br />
                    Status: Available<br />
                    ⭐ {driver.rating} | 🚗 {driver.vehicleType}<br />
                    📍 {driver.location.address}
                  </div>
                </Popup>
                <Tooltip>{driver.name} (Available)</Tooltip>
              </Marker>
            ))}

            {/* Route waypoints */}
            {routes.map((route, idx) => (
              route.waypoints.map((point, pointIdx) => {
                let icon;
                if (point.type === "pickup") icon = pickupIcon;
                else if (point.type === "dropoff") icon = dropoffIcon;
                else return null;
                
                return (
                  <Marker
                    key={`${route.id}-${pointIdx}`}
                    position={[point.lat, point.lng]}
                    icon={icon}
                  >
                    <Popup>
                      <div className="text-sm">
                        <strong>{point.label}</strong><br />
                        Route: {route.driverName} → {route.orderId}<br />
                        {point.type === "pickup" && `Customer: ${route.customer}`}<br />
                        {point.type === "dropoff" && `ETA: ${route.eta}`}
                      </div>
                    </Popup>
                  </Marker>
                );
              })
            ))}

            {/* Pending order markers */}
            {orders.filter(o => o.status === "pending").map(order => (
              <CircleMarker
                key={`pending-${order.id}`}
                center={[order.pickup.lat, order.pickup.lng]}
                radius={8}
                fillColor="#f97316"
                color="white"
                weight={2}
                fillOpacity={0.8}
              >
                <Popup>
                  <div>
                    <strong>{order.id}</strong><br />
                    Customer: {order.customer}<br />
                    Priority: {order.priority}<br />
                    Quantity: {order.quantity}<br />
                    Value: ${order.estimatedValue}
                  </div>
                </Popup>
                <Tooltip>{order.id} - {order.priority}</Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Available Driver</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Pending Order</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-green-500"></div>
            <span>High Score Route (80%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-blue-500"></div>
            <span>Medium Score Route (60-79%)</span>
          </div>
        </div>
      </GlassCard>

      {/* Routes List */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">📋 Assigned Routes</h2>
          <span className="text-sm text-gray-400">{routes.length} active routes</span>
        </div>

        {routes.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No routes optimized yet. Click "Optimize Routes" to create delivery routes.
          </p>
        ) : (
          <div className="space-y-3">
            {routes.map((route, i) => (
              <div
                key={route.id}
                className={`bg-white/5 rounded-lg p-4 hover:bg-white/10 transition cursor-pointer ${
                  selectedRoute?.id === route.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedRoute(selectedRoute?.id === route.id ? null : route)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-lg">{route.id}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(route.priority)}`}>
                        {route.priority.toUpperCase()}
                      </span>
                      <span className="text-green-400 text-sm">Match: {route.optimizationScore}%</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm">
                      <div>
                        <p className="text-gray-500">🚚 Driver</p>
                        <p className="font-medium">{route.driverName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">📦 Order</p>
                        <p>{route.orderId} - {route.customer}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">⏱️ ETA</p>
                        <p>{route.eta}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-500 text-sm">Distance: {route.distance} km</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">
                      Score: {route.optimizationScore}%
                    </div>
                  </div>
                </div>

                {/* Expanded Route Details */}
                {selectedRoute?.id === route.id && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Route Details</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs">1</span>
                            <span>Pickup from: {route.waypoints[1]?.label || route.orderId}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs">2</span>
                            <span>Deliver to: {route.waypoints[2]?.label || route.orderId}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-2">Performance Metrics</p>
                        <div className="space-y-1 text-sm">
                          <p>⭐ Driver Rating: {drivers.find(d => d.id === route.driverId)?.rating || "N/A"}</p>
                          <p>📊 Optimization Score: {route.optimizationScore}%</p>
                          <p>🛣️ Total Distance: {route.distance} km</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => {
                          setMapCenter(route.path[0]);
                          setMapZoom(14);
                        }}
                        className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-sm hover:bg-blue-500/30 transition"
                      >
                        Focus on Map
                      </button>
                      <button className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm hover:bg-green-500/30 transition">
                        Start Delivery
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Optimization Tips */}
      {routes.length > 0 && (
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">💡 Optimization Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/5 p-3 rounded">
              <span className="text-yellow-400">📊 Score Interpretation:</span>
              <p className="text-gray-400 mt-1">80%+ = Excellent match, 60-79% = Good match, Below 60% = Consider reassigning</p>
            </div>
            <div className="bg-white/5 p-3 rounded">
              <span className="text-blue-400">🎯 Priority Handling:</span>
              <p className="text-gray-400 mt-1">Urgent orders get +50% score bonus for faster assignment</p>
            </div>
            <div className="bg-white/5 p-3 rounded">
              <span className="text-green-400">🚀 Optimization Strategy:</span>
              <p className="text-gray-400 mt-1">Switch between Distance/Time/Balanced for different scenarios</p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default RoutesPage;