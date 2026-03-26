 import { useState, useEffect, useRef } from "react";
import GlassCard from "../components/common/GlassCard";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom driver icons
const createDriverIcon = (status, color) => {
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

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMap, setShowMap] = useState(true);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);
  const [mapZoom, setMapZoom] = useState(12);
  const [countdowns, setCountdowns] = useState({});
  const mapRef = useRef(null);

  // Real-time countdown timer for drivers
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      drivers.forEach(driver => {
        if (driver.estimatedFreeTime && driver.status === "busy") {
          const freeTime = new Date(driver.estimatedFreeTime);
          const now = new Date();
          const diffSeconds = Math.max(0, Math.floor((freeTime - now) / 1000));
          const minutes = Math.floor(diffSeconds / 60);
          const seconds = diffSeconds % 60;
          newCountdowns[driver.id] = { minutes, seconds, totalSeconds: diffSeconds };
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [drivers]);

  // Mock data with road-based routes (simulated using waypoints)
  useEffect(() => {
    setTimeout(() => {
      const mockDrivers = [
        {
          id: "DRV-001",
          name: "Michael Chen",
          email: "michael.chen@example.com",
          phone: "+1 234 567 8901",
          rating: 4.8,
          totalDeliveries: 156,
          completedToday: 5,
          status: "busy",
          currentLocation: { lat: 40.7128, lng: -74.0060, address: "123 Main St, Downtown" },
          currentRoute: [
            { lat: 40.7128, lng: -74.0060, address: "Current: 123 Main St", eta: "0 min", status: "current" },
            { lat: 40.7180, lng: -74.0120, address: "Via: Broadway", eta: "5 min", status: "waypoint" },
            { lat: 40.7250, lng: -74.0180, address: "Pickup: Starbucks", eta: "8 min", status: "pickup" },
            { lat: 40.7350, lng: -74.0250, address: "Via: 5th Ave", eta: "12 min", status: "waypoint" },
            { lat: 40.7480, lng: -74.0320, address: "Dropoff: Office Building", eta: "18 min", status: "dropoff" },
            { lat: 40.7580, lng: -73.9855, address: "Final: 456 Park Ave", eta: "25 min", status: "final" }
          ],
          currentOrder: "ORD-002",
          estimatedFreeTime: new Date(Date.now() + 1800000).toISOString(),
          speed: "25 km/h",
          lastActive: new Date().toISOString(),
          joinedDate: "2024-01-15",
          vehicleType: "Motorcycle",
          vehiclePlate: "NYC-1234",
          activeRouteId: "RTE-001",
        },
        {
          id: "DRV-002",
          name: "Sarah Williams",
          email: "sarah.williams@example.com",
          phone: "+1 234 567 8902",
          rating: 4.9,
          totalDeliveries: 203,
          completedToday: 7,
          status: "busy",
          currentLocation: { lat: 40.7580, lng: -73.9855, address: "456 Park Ave, Midtown" },
          currentRoute: [
            { lat: 40.7580, lng: -73.9855, address: "Current: 456 Park Ave", eta: "0 min", status: "current" },
            { lat: 40.7520, lng: -73.9780, address: "Via: Madison Ave", eta: "3 min", status: "waypoint" },
            { lat: 40.7450, lng: -73.9720, address: "Pickup: Restaurant", eta: "6 min", status: "pickup" },
            { lat: 40.7350, lng: -73.9650, address: "Via: 34th St", eta: "10 min", status: "waypoint" },
            { lat: 40.7489, lng: -73.9680, address: "Dropoff: 789 Broadway", eta: "15 min", status: "dropoff" },
            { lat: 40.7829, lng: -73.9654, address: "Final: 890 3rd Ave", eta: "22 min", status: "final" }
          ],
          currentOrder: "ORD-003",
          estimatedFreeTime: new Date(Date.now() + 1320000).toISOString(),
          speed: "30 km/h",
          lastActive: new Date().toISOString(),
          joinedDate: "2024-02-20",
          vehicleType: "Car",
          vehiclePlate: "NYC-5678",
          activeRouteId: "RTE-002",
        },
        {
          id: "DRV-003",
          name: "David Rodriguez",
          email: "david.rodriguez@example.com",
          phone: "+1 234 567 8903",
          rating: 4.7,
          totalDeliveries: 98,
          completedToday: 3,
          status: "available",
          currentLocation: { lat: 40.7489, lng: -73.9680, address: "789 Broadway, Brooklyn" },
          currentRoute: [],
          currentOrder: null,
          estimatedFreeTime: null,
          speed: "0 km/h",
          lastActive: new Date(Date.now() - 3600000).toISOString(),
          joinedDate: "2024-03-10",
          vehicleType: "Bicycle",
          vehiclePlate: "NYC-9012",
          activeRouteId: null,
        },
        {
          id: "DRV-004",
          name: "Emily Brown",
          email: "emily.brown@example.com",
          phone: "+1 234 567 8904",
          rating: 5.0,
          totalDeliveries: 312,
          completedToday: 8,
          status: "available",
          currentLocation: { lat: 40.7829, lng: -73.9654, address: "890 3rd Ave, Queens" },
          currentRoute: [],
          currentOrder: null,
          estimatedFreeTime: null,
          speed: "0 km/h",
          lastActive: new Date(Date.now() - 1800000).toISOString(),
          joinedDate: "2023-11-05",
          vehicleType: "Car",
          vehiclePlate: "NYC-3456",
          activeRouteId: null,
        },
        {
          id: "DRV-005",
          name: "James Wilson",
          email: "james.wilson@example.com",
          phone: "+1 234 567 8905",
          rating: 4.6,
          totalDeliveries: 67,
          completedToday: 2,
          status: "offline",
          currentLocation: { lat: 40.7128, lng: -74.0060, address: "Home Base" },
          currentRoute: [],
          currentOrder: null,
          estimatedFreeTime: null,
          speed: "0 km/h",
          lastActive: new Date(Date.now() - 86400000).toISOString(),
          joinedDate: "2024-04-01",
          vehicleType: "Motorcycle",
          vehiclePlate: "NYC-7890",
          activeRouteId: null,
        },
      ];

      const mockOrders = [
        {
          id: "ORD-001",
          customer: "John Doe",
          pickupLocation: { lat: 40.7128, lng: -74.0060, address: "123 Main St, Downtown" },
          dropoffLocation: { lat: 40.7580, lng: -73.9855, address: "456 Park Ave, Uptown" },
          status: "pending",
          priority: "high",
        },
        {
          id: "ORD-004",
          customer: "Sarah Williams",
          pickupLocation: { lat: 40.7829, lng: -73.9654, address: "234 1st Ave, Manhattan" },
          dropoffLocation: { lat: 40.7128, lng: -74.0060, address: "567 2nd Ave, Bronx" },
          status: "pending",
          priority: "normal",
        },
        {
          id: "ORD-005",
          customer: "Alice Johnson",
          pickupLocation: { lat: 40.7580, lng: -73.9855, address: "111 5th Ave, Midtown" },
          dropoffLocation: { lat: 40.7489, lng: -73.9680, address: "222 6th Ave, Brooklyn" },
          status: "pending",
          priority: "urgent",
        },
      ];

      setDrivers(mockDrivers);
      setOrders(mockOrders);
      setPendingOrders(mockOrders.filter(o => o.status === "pending"));
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case "available": return "bg-green-500/20 text-green-400";
      case "busy": return "bg-yellow-500/20 text-yellow-400";
      case "offline": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "available": return "🟢";
      case "busy": return "🟡";
      case "offline": return "🔴";
      default: return "⚪";
    }
  };

  const formatEstimatedFreeTime = (driverId, timestamp) => {
    if (!timestamp) return "Not assigned";
    const cd = countdowns[driverId];
    if (cd && cd.totalSeconds > 0) {
      return `${cd.minutes}:${cd.seconds.toString().padStart(2, '0')} min`;
    }
    return "Now";
  };

  const calculateRouteMatch = (driver, order) => {
    if (!driver.currentLocation || !order.pickupLocation) return 0;
    
    const driverLat = driver.currentLocation.lat;
    const driverLng = driver.currentLocation.lng;
    const pickupLat = order.pickupLocation.lat;
    const pickupLng = order.pickupLocation.lng;
    
    const distance = Math.sqrt(
      Math.pow(pickupLat - driverLat, 2) + 
      Math.pow(pickupLng - driverLng, 2)
    );
    
    const matchScore = Math.max(0, 100 - distance * 100);
    return Math.min(100, matchScore);
  };

  const findBestDriverForOrder = (order) => {
    const availableDrivers = drivers.filter(d => d.status === "available");
    if (availableDrivers.length === 0) return null;
    
    return availableDrivers.reduce((best, driver) => {
      const matchScore = calculateRouteMatch(driver, order);
      return matchScore > (best.matchScore || 0) ? { driver, matchScore } : best;
    }, { driver: null, matchScore: 0 });
  };

  const handleAssignOrder = (driverId, orderId) => {
    const order = orders.find(o => o.id === orderId);
    const driver = drivers.find(d => d.id === driverId);
    
    if (!order || !driver) return;
    
    const newRoute = [
      { lat: driver.currentLocation.lat, lng: driver.currentLocation.lng, address: `Current: ${driver.currentLocation.address}`, eta: "0 min", status: "current" },
      { lat: (driver.currentLocation.lat + order.pickupLocation.lat) / 2, lng: (driver.currentLocation.lng + order.pickupLocation.lng) / 2, address: "Via: Route", eta: "8 min", status: "waypoint" },
      { lat: order.pickupLocation.lat, lng: order.pickupLocation.lng, address: `Pickup: ${order.pickupLocation.address}`, eta: "15 min", status: "pickup" },
      { lat: (order.pickupLocation.lat + order.dropoffLocation.lat) / 2, lng: (order.pickupLocation.lng + order.dropoffLocation.lng) / 2, address: "Via: Route", eta: "22 min", status: "waypoint" },
      { lat: order.dropoffLocation.lat, lng: order.dropoffLocation.lng, address: `Dropoff: ${order.dropoffLocation.address}`, eta: "30 min", status: "final" }
    ];
    
    setDrivers(drivers.map(d => 
      d.id === driverId 
        ? { 
            ...d, 
            status: "busy",
            currentOrder: orderId,
            estimatedFreeTime: new Date(Date.now() + 1800000).toISOString(),
            currentRoute: newRoute
          }
        : d
    ));
    
    setOrders(orders.map(o => 
      o.id === orderId 
        ? { ...o, status: "assigned", driverId }
        : o
    ));
    
    setPendingOrders(pendingOrders.filter(o => o.id !== orderId));
    alert(`Order ${orderId} assigned to ${driver.name} successfully!`);
  };

  const filteredDrivers = drivers.filter(driver => {
    if (filterStatus !== "all" && driver.status !== filterStatus) return false;
    if (searchTerm && !driver.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !driver.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const availableDrivers = drivers.filter(d => d.status === "available").length;
  const busyDrivers = drivers.filter(d => d.status === "busy").length;
  const offlineDrivers = drivers.filter(d => d.status === "offline").length;
  const avgRating = (drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1);

  // Get route color based on status
  const getRouteColor = (status) => {
    switch(status) {
      case "current": return "#22c55e";
      case "pickup": return "#3b82f6";
      case "dropoff": return "#f59e0b";
      case "final": return "#ef4444";
      default: return "#6b7280";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-white text-xl">Loading driver data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Drivers Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMap(!showMap)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
          >
            {showMap ? "Hide Live Map" : "Show Live Map"}
          </button>
        </div>
      </div>
      
      {/* Driver Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Total Drivers</p>
              <p className="text-2xl font-bold mt-1">{drivers.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400">👥</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Available Drivers</p>
              <p className="text-2xl font-bold mt-1 text-green-400">{availableDrivers}</p>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400">🟢</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">On Delivery</p>
              <p className="text-2xl font-bold mt-1 text-yellow-400">{busyDrivers}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-yellow-400">🟡</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Average Rating</p>
              <p className="text-2xl font-bold mt-1">{avgRating}⭐</p>
            </div>
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-purple-400">⭐</span>
            </div>
          </div>
        </GlassCard>
      </div>
      
      {/* Live Map View with Enhanced Features */}
      {showMap && (
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">🗺️ Live Driver Tracking & Route Optimization</h2>
          <div className="h-[500px] rounded-lg overflow-hidden">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Draw routes for busy drivers */}
              {drivers.filter(d => d.status === "busy" && d.currentRoute?.length > 0).map(driver => (
                <Polyline
                  key={`route-${driver.id}`}
                  positions={driver.currentRoute.map(point => [point.lat, point.lng])}
                  color="#3b82f6"
                  weight={4}
                  opacity={0.8}
                  dashArray="5, 10"
                />
              ))}
              
              {/* Draw waypoints and stops for routes */}
              {drivers.filter(d => d.status === "busy" && d.currentRoute?.length > 0).map(driver => (
                driver.currentRoute.map((point, idx) => (
                  <CircleMarker
                    key={`waypoint-${driver.id}-${idx}`}
                    center={[point.lat, point.lng]}
                    radius={idx === 0 ? 8 : 6}
                    fillColor={getRouteColor(point.status)}
                    color="white"
                    weight={2}
                    fillOpacity={0.9}
                  >
                    <Tooltip permanent={idx === 0 || idx === driver.currentRoute.length - 1}>
                      <div className="text-xs">
                        <strong>{point.address}</strong><br />
                        ETA: {point.eta}
                      </div>
                    </Tooltip>
                  </CircleMarker>
                ))
              ))}
              
              {/* Driver Markers */}
              {drivers.map(driver => {
                const getMarkerColor = () => {
                  if (driver.status === "available") return "#22c55e";
                  if (driver.status === "busy") return "#eab308";
                  return "#ef4444";
                };
                
                const getMarkerIcon = () => {
                  return L.divIcon({
                    className: 'custom-driver-icon',
                    html: `<div style="
                      width: 40px;
                      height: 40px;
                      background: ${getMarkerColor()};
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      border: 3px solid white;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                      font-size: 20px;
                    ">🚗</div>`,
                    iconSize: [40, 40],
                    iconAnchor: [20, 20],
                    popupAnchor: [0, -20],
                  });
                };
                
                return (
                  <Marker
                    key={driver.id}
                    position={[driver.currentLocation.lat, driver.currentLocation.lng]}
                    icon={getMarkerIcon()}
                  >
                    <Popup>
                      <div className="text-sm">
                        <strong className="text-lg">{driver.name}</strong><br />
                        Status: {driver.status.toUpperCase()}<br />
                        ⭐ {driver.rating} | 📦 {driver.completedToday} today<br />
                        {driver.status === "busy" && (
                          <>⏱️ Free in: {formatEstimatedFreeTime(driver.id, driver.estimatedFreeTime)}<br />
                          🚗 Speed: {driver.speed}<br /></>
                        )}
                        📍 {driver.currentLocation.address}
                      </div>
                    </Popup>
                    <Tooltip direction="top" offset={[0, -20]} permanent={false}>
                      <span>{driver.name} ({driver.status})</span>
                    </Tooltip>
                  </Marker>
                );
              })}
              
              {/* Pending Order Markers */}
              {pendingOrders.map(order => (
                <Marker
                  key={`order-${order.id}`}
                  position={[order.pickupLocation.lat, order.pickupLocation.lng]}
                  icon={L.divIcon({
                    className: 'order-marker',
                    html: `<div style="
                      width: 28px;
                      height: 28px;
                      background: #f97316;
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      border: 2px solid white;
                      font-size: 14px;
                    ">📦</div>`,
                    iconSize: [28, 28],
                    iconAnchor: [14, 14],
                  })}
                >
                  <Popup>
                    <div>
                      <strong>{order.id}</strong><br />
                      Customer: {order.customer}<br />
                      Priority: {order.priority}<br />
                      Pickup: {order.pickupLocation.address}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Available Driver</span>
              <div className="w-8 h-0.5 bg-blue-500 ml-2"></div>
              <span className="text-sm text-gray-300">Route Path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Busy Driver</span>
              <div className="w-4 h-4 bg-orange-500 rounded-full ml-2"></div>
              <span className="text-sm text-gray-300">Pending Order</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-300">Start/Current</span>
              <div className="w-4 h-4 bg-red-500 rounded-full ml-2"></div>
              <span className="text-sm text-gray-300">Final Destination</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 mt-2">
            🚚 Showing {busyDrivers} active drivers on optimized road routes | Real-time ETA tracking
          </p>
        </GlassCard>
      )}
      
      {/* Smart Order Assignment Section */}
      {pendingOrders.length > 0 && availableDrivers > 0 && (
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">🚀 Smart Route-Based Assignment</h2>
          <p className="text-sm text-gray-400 mb-4">
            Automatically matching pending orders with available drivers based on optimized road routes
          </p>
          <div className="space-y-4">
            {pendingOrders.slice(0, 3).map(order => {
              const bestMatch = findBestDriverForOrder(order);
              return (
                <div key={order.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{order.id}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.priority === "urgent" ? "bg-red-500/20 text-red-400" :
                          order.priority === "high" ? "bg-orange-500/20 text-orange-400" :
                          "bg-blue-500/20 text-blue-400"
                        }`}>
                          {order.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{order.customer}</p>
                      <p className="text-xs text-gray-400">From: {order.pickupLocation.address}</p>
                      <p className="text-xs text-gray-400">To: {order.dropoffLocation.address}</p>
                    </div>
                    <div className="text-right">
                      {bestMatch.driver ? (
                        <>
                          <p className="text-sm text-green-400">Best match: {bestMatch.driver.name}</p>
                          <p className="text-xs text-gray-400">Route match: {Math.round(bestMatch.matchScore)}%</p>
                          <button
                            onClick={() => handleAssignOrder(bestMatch.driver.id, order.id)}
                            className="mt-2 bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm hover:bg-green-500/30 transition"
                          >
                            Assign to {bestMatch.driver.name}
                          </button>
                        </>
                      ) : (
                        <p className="text-sm text-yellow-400">No available drivers</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}
      
      {/* Filter and Search */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg transition ${filterStatus === "all" ? "bg-blue-500 text-white" : "bg-white/10 hover:bg-white/20"}`}
            >
              All ({drivers.length})
            </button>
            <button
              onClick={() => setFilterStatus("available")}
              className={`px-4 py-2 rounded-lg transition ${filterStatus === "available" ? "bg-green-500 text-white" : "bg-white/10 hover:bg-white/20"}`}
            >
              Available ({availableDrivers})
            </button>
            <button
              onClick={() => setFilterStatus("busy")}
              className={`px-4 py-2 rounded-lg transition ${filterStatus === "busy" ? "bg-yellow-500 text-white" : "bg-white/10 hover:bg-white/20"}`}
            >
              On Delivery ({busyDrivers})
            </button>
            <button
              onClick={() => setFilterStatus("offline")}
              className={`px-4 py-2 rounded-lg transition ${filterStatus === "offline" ? "bg-red-500 text-white" : "bg-white/10 hover:bg-white/20"}`}
            >
              Offline ({offlineDrivers})
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-64"
          />
        </div>
        
        <h2 className="text-xl font-semibold mb-4">
          Active Drivers ({filteredDrivers.length})
        </h2>
        
        <div className="space-y-4">
          {filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition cursor-pointer"
              onClick={() => setSelectedDriver(selectedDriver?.id === driver.id ? null : driver)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-lg">{driver.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(driver.status)}`}>
                      {getStatusIcon(driver.status)} {driver.status.toUpperCase()}
                    </span>
                    <span className="text-yellow-400">⭐ {driver.rating}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm">
                    <div>
                      <p className="text-gray-500">📞 {driver.phone}</p>
                      <p className="text-gray-500">📧 {driver.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">🚗 {driver.vehicleType} | {driver.vehiclePlate}</p>
                      <p className="text-gray-500">📦 {driver.totalDeliveries} deliveries | {driver.completedToday} today</p>
                    </div>
                    <div>
                      <p className="text-gray-500">📍 {driver.currentLocation.address}</p>
                      {driver.status === "busy" && (
                        <p className="text-yellow-400 text-xs font-mono">
                          ⏱️ Free in: {formatEstimatedFreeTime(driver.id, driver.estimatedFreeTime)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400">
                  <div>Speed: {driver.speed}</div>
                  <div>Last active: {new Date(driver.lastActive).toLocaleTimeString()}</div>
                </div>
              </div>
              
              {/* Expanded Driver Details */}
              {selectedDriver?.id === driver.id && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  {driver.status === "busy" && driver.currentRoute && driver.currentRoute.length > 0 && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm mb-2">🗺️ Optimized Road Route</p>
                      <div className="space-y-2">
                        {driver.currentRoute.map((stop, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm bg-white/5 p-2 rounded">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              stop.status === "current" ? "bg-green-500" :
                              stop.status === "pickup" ? "bg-blue-500" :
                              stop.status === "dropoff" ? "bg-orange-500" :
                              stop.status === "final" ? "bg-red-500" : "bg-gray-500"
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="flex-1">{stop.address}</span>
                            <span className="text-gray-400">{stop.eta}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Current Order</p>
                      <p className="text-sm">{driver.currentOrder || "No active order"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Performance</p>
                      <p className="text-sm">⭐ Rating: {driver.rating}/5</p>
                      <p className="text-sm">✅ Completion Rate: {driver.totalDeliveries > 0 ? Math.round((driver.completedToday / driver.totalDeliveries) * 100) : 0}%</p>
                    </div>
                  </div>
                  
                  {driver.status === "available" && pendingOrders.length > 0 && (
                    <div className="mt-4">
                      <p className="text-gray-400 text-sm mb-2">Suggest Orders for {driver.name}</p>
                      <div className="space-y-2">
                        {pendingOrders.slice(0, 2).map(order => {
                          const matchScore = calculateRouteMatch(driver, order);
                          return (
                            <div key={order.id} className="flex justify-between items-center bg-white/5 p-2 rounded">
                              <div>
                                <p className="text-sm font-semibold">{order.id}</p>
                                <p className="text-xs text-gray-400">{order.pickupLocation.address}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-green-400">{Math.round(matchScore)}% route match</p>
                                <button
                                  onClick={() => handleAssignOrder(driver.id, order.id)}
                                  className="mt-1 bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs hover:bg-blue-500/30 transition"
                                >
                                  Assign Order
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Mini map preview */}
                  {driver.status === "busy" && driver.currentRoute && driver.currentRoute.length > 0 && (
                    <div className="mt-4">
                      <p className="text-gray-400 text-sm mb-2">Route Preview</p>
                      <div className="h-32 bg-gray-800 rounded-lg overflow-hidden">
                        <MapContainer
                          center={[driver.currentLocation.lat, driver.currentLocation.lng]}
                          zoom={13}
                          style={{ height: "100%", width: "100%" }}
                          zoomControl={false}
                          attributionControl={false}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Polyline
                            positions={driver.currentRoute.map(point => [point.lat, point.lng])}
                            color="#3b82f6"
                            weight={3}
                          />
                          <Marker position={[driver.currentLocation.lat, driver.currentLocation.lng]} />
                        </MapContainer>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {filteredDrivers.length === 0 && (
            <p className="text-gray-400 text-center py-8">No drivers found.</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default Drivers;