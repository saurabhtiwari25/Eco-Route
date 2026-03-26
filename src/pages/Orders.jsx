import { useState, useEffect } from "react";
import GlassCard from "../components/common/GlassCard";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form state
  const [customer, setCustomer] = useState("");
  const [pickupLat, setPickupLat] = useState("");
  const [pickupLng, setPickupLng] = useState("");
  const [dropoffLat, setDropoffLat] = useState("");
  const [dropoffLng, setDropoffLng] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [specialRequest, setSpecialRequest] = useState("");
  const [orderType, setOrderType] = useState("food");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [priority, setPriority] = useState("normal");

  // Mock data - In production, this would come from your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockOrders = [
        {
          id: "ORD-001",
          customer: "John Doe",
          contactPhone: "+1 234 567 8901",
          pickupLocation: { lat: 40.7128, lng: -74.0060, address: "123 Main St, Downtown" },
          dropoffLocation: { lat: 40.7580, lng: -73.9855, address: "456 Park Ave, Uptown" },
          quantity: 3,
          items: ["Pizza x2", "Soda x1"],
          specialRequest: "Leave at front door, ring bell twice",
          orderType: "food",
          estimatedValue: 45.50,
          priority: "high",
          status: "pending",
          createdAt: new Date().toISOString(),
          driverId: null,
          estimatedDeliveryTime: null,
        },
        {
          id: "ORD-002",
          customer: "Jane Smith",
          contactPhone: "+1 234 567 8902",
          pickupLocation: { lat: 40.7580, lng: -73.9855, address: "789 Broadway, Midtown" },
          dropoffLocation: { lat: 40.7489, lng: -73.9680, address: "321 5th Ave, Downtown" },
          quantity: 1,
          items: ["Package - Electronics"],
          specialRequest: "Handle with care, fragile item",
          orderType: "package",
          estimatedValue: 299.99,
          priority: "urgent",
          status: "assigned",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          driverId: "DRV-001",
          estimatedDeliveryTime: new Date(Date.now() + 1800000).toISOString(),
        },
        {
          id: "ORD-003",
          customer: "Bob Johnson",
          contactPhone: "+1 234 567 8903",
          pickupLocation: { lat: 40.7489, lng: -73.9680, address: "567 8th Ave, Brooklyn" },
          dropoffLocation: { lat: 40.7829, lng: -73.9654, address: "890 3rd Ave, Queens" },
          quantity: 2,
          items: ["Documents x2"],
          specialRequest: "Need signature on delivery",
          orderType: "document",
          estimatedValue: 0,
          priority: "normal",
          status: "delivered",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          driverId: "DRV-002",
          estimatedDeliveryTime: new Date(Date.now() - 7200000).toISOString(),
          completedAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: "ORD-004",
          customer: "Sarah Williams",
          contactPhone: "+1 234 567 8904",
          pickupLocation: { lat: 40.7829, lng: -73.9654, address: "234 1st Ave, Manhattan" },
          dropoffLocation: { lat: 40.7128, lng: -74.0060, address: "567 2nd Ave, Bronx" },
          quantity: 5,
          items: ["Groceries x5"],
          specialRequest: "Include ice packs for frozen items",
          orderType: "groceries",
          estimatedValue: 125.75,
          priority: "normal",
          status: "pending",
          createdAt: new Date().toISOString(),
          driverId: null,
          estimatedDeliveryTime: null,
        },
      ];

      const mockDrivers = [
        { id: "DRV-001", name: "Michael Chen", status: "busy", rating: 4.8 },
        { id: "DRV-002", name: "Sarah Williams", status: "available", rating: 4.9 },
        { id: "DRV-003", name: "David Rodriguez", status: "available", rating: 4.7 },
      ];

      setOrders(mockOrders);
      setDrivers(mockDrivers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      customer,
      contactPhone,
      pickupLocation: { 
        lat: parseFloat(pickupLat), 
        lng: parseFloat(pickupLng), 
        address: pickupAddress 
      },
      dropoffLocation: { 
        lat: parseFloat(dropoffLat), 
        lng: parseFloat(dropoffLng), 
        address: dropoffAddress 
      },
      quantity: parseInt(quantity),
      items: [],
      specialRequest,
      orderType,
      estimatedValue: parseFloat(estimatedValue) || 0,
      priority,
      status: "pending",
      createdAt: new Date().toISOString(),
      driverId: null,
      estimatedDeliveryTime: null,
    };
    
    setOrders([newOrder, ...orders]);
    alert(`Order created successfully for ${customer}! Order ID: ${newOrder.id}`);
    
    // Reset form
    setCustomer("");
    setContactPhone("");
    setPickupLat("");
    setPickupLng("");
    setPickupAddress("");
    setDropoffLat("");
    setDropoffLng("");
    setDropoffAddress("");
    setQuantity(1);
    setSpecialRequest("");
    setOrderType("food");
    setEstimatedValue("");
    setPriority("normal");
  };

  const handleAssignDriver = (orderId, driverId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, driverId, status: "assigned", estimatedDeliveryTime: new Date(Date.now() + 3600000).toISOString() }
        : order
    ));
    alert(`Order ${orderId} assigned to driver successfully!`);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, completedAt: newStatus === "delivered" ? new Date().toISOString() : order.completedAt }
        : order
    ));
    alert(`Order ${orderId} status updated to ${newStatus}`);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter(order => order.id !== orderId));
      alert(`Order ${orderId} deleted successfully`);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "assigned": return "bg-blue-500/20 text-blue-400";
      case "delivered": return "bg-green-500/20 text-green-400";
      case "cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "urgent": return "bg-red-500/20 text-red-400";
      case "high": return "bg-orange-500/20 text-orange-400";
      case "normal": return "bg-blue-500/20 text-blue-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getOrderTypeIcon = (type) => {
    switch(type) {
      case "food": return "🍔";
      case "package": return "📦";
      case "document": return "📄";
      case "groceries": return "🛒";
      default: return "📦";
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus !== "all" && order.status !== filterStatus) return false;
    if (searchTerm && !order.customer.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !order.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const assignedOrders = orders.filter(o => o.status === "assigned").length;
  const deliveredOrders = orders.filter(o => o.status === "delivered").length;
  const totalValue = orders.reduce((sum, o) => sum + (o.estimatedValue || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-white text-xl">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <div className="text-sm text-gray-400">
          Total Orders: {orders.length}
        </div>
      </div>
      
      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Pending Orders</p>
              <p className="text-2xl font-bold mt-1">{pendingOrders}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-yellow-400">⏳</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Assigned Orders</p>
              <p className="text-2xl font-bold mt-1">{assignedOrders}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400">🚚</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Delivered Orders</p>
              <p className="text-2xl font-bold mt-1">{deliveredOrders}</p>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400">✅</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Total Value</p>
              <p className="text-2xl font-bold mt-1">${totalValue.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-purple-400">💰</span>
            </div>
          </div>
        </GlassCard>
      </div>
      
      {/* Create New Order Form */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contact Phone *
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pickup Address *
              </label>
              <input
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Street address, city"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dropoff Address *
              </label>
              <input
                type="text"
                value={dropoffAddress}
                onChange={(e) => setDropoffAddress(e.target.value)}
                placeholder="Street address, city"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pickup Lat
                </label>
                <input
                  type="number"
                  step="any"
                  value={pickupLat}
                  onChange={(e) => setPickupLat(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pickup Lng
                </label>
                <input
                  type="number"
                  step="any"
                  value={pickupLng}
                  onChange={(e) => setPickupLng(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dropoff Lat
                </label>
                <input
                  type="number"
                  step="any"
                  value={dropoffLat}
                  onChange={(e) => setDropoffLat(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dropoff Lng
                </label>
                <input
                  type="number"
                  step="any"
                  value={dropoffLng}
                  onChange={(e) => setDropoffLng(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Order Type
              </label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="food">Food Delivery</option>
                <option value="package">Package Delivery</option>
                <option value="document">Document Delivery</option>
                <option value="groceries">Groceries</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Estimated Value ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Special Request / Instructions
            </label>
            <textarea
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              rows="3"
              placeholder="Any special instructions for the driver..."
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Create Order
          </button>
        </form>
      </GlassCard>
      
      {/* Filter and Search */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg transition ${filterStatus === "all" ? "bg-blue-500 text-white" : "bg-white/10 hover:bg-white/20"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-4 py-2 rounded-lg transition ${filterStatus === "pending" ? "bg-yellow-500 text-white" : "bg-white/10 hover:bg-white/20"}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus("assigned")}
              className={`px-4 py-2 rounded-lg transition ${filterStatus === "assigned" ? "bg-blue-500 text-white" : "bg-white/10 hover:bg-white/20"}`}
            >
              Assigned
            </button>
            <button
              onClick={() => setFilterStatus("delivered")}
              className={`px-4 py-2 rounded-lg transition ${filterStatus === "delivered" ? "bg-green-500 text-white" : "bg-white/10 hover:bg-white/20"}`}
            >
              Delivered
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-64"
          />
        </div>
        
        <h2 className="text-xl font-semibold mb-4">
          Orders ({filteredOrders.length})
          {filterStatus !== "all" && ` - ${filterStatus}`}
        </h2>
        
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition cursor-pointer"
              onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-lg">{order.id}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(order.priority)}`}>
                      {order.priority.toUpperCase()}
                    </span>
                    <span className="text-xl">{getOrderTypeIcon(order.orderType)}</span>
                  </div>
                  <p className="text-gray-300 mt-1">{order.customer}</p>
                  <p className="text-sm text-gray-400">{order.contactPhone}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span>📦 Qty: {order.quantity}</span>
                    {order.estimatedValue > 0 && (
                      <span>💰 ${order.estimatedValue.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400">
                  <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                  <div>{new Date(order.createdAt).toLocaleTimeString()}</div>
                </div>
              </div>
              
              {/* Expanded Order Details */}
              {selectedOrder?.id === order.id && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Pickup Location</p>
                      <p className="text-sm">{order.pickupLocation.address}</p>
                      <p className="text-xs font-mono text-gray-500">
                        {order.pickupLocation.lat}, {order.pickupLocation.lng}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Dropoff Location</p>
                      <p className="text-sm">{order.dropoffLocation.address}</p>
                      <p className="text-xs font-mono text-gray-500">
                        {order.dropoffLocation.lat}, {order.dropoffLocation.lng}
                      </p>
                    </div>
                  </div>
                  
                  {order.specialRequest && (
                    <div className="mt-3">
                      <p className="text-gray-400 text-sm">Special Request</p>
                      <p className="text-sm bg-yellow-500/10 p-2 rounded border border-yellow-500/30">
                        📝 {order.specialRequest}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-gray-400 text-sm">Driver Assignment</p>
                      {order.driverId ? (
                        <p className="text-sm text-green-400">
                          {drivers.find(d => d.id === order.driverId)?.name || "Assigned"}
                        </p>
                      ) : (
                        <select
                          className="mt-1 px-3 py-1 bg-white/10 border border-white/20 rounded text-sm"
                          onChange={(e) => handleAssignDriver(order.id, e.target.value)}
                          value=""
                        >
                          <option value="">Assign Driver</option>
                          {drivers.filter(d => d.status === "available").map(driver => (
                            <option key={driver.id} value={driver.id}>{driver.name} (⭐{driver.rating})</option>
                          ))}
                        </select>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm">Order Status</p>
                      {order.status !== "delivered" && order.status !== "cancelled" ? (
                        <select
                          className="mt-1 px-3 py-1 bg-white/10 border border-white/20 rounded text-sm"
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          value={order.status}
                        >
                          <option value="pending">Pending</option>
                          <option value="assigned">Assigned</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <p className="text-sm text-gray-400 mt-1">
                          {order.status === "delivered" && `Delivered on ${new Date(order.completedAt).toLocaleString()}`}
                          {order.status === "cancelled" && "Cancelled"}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {order.estimatedDeliveryTime && order.status === "assigned" && (
                    <div className="mt-3">
                      <p className="text-gray-400 text-sm">Estimated Delivery</p>
                      <p className="text-sm text-blue-400">
                        {new Date(order.estimatedDeliveryTime).toLocaleString()}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleUpdateStatus(order.id, "delivered")}
                      disabled={order.status === "delivered"}
                      className={`px-3 py-1 rounded text-sm ${
                        order.status === "delivered"
                          ? "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                          : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      }`}
                    >
                      Mark Delivered
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="bg-red-500/20 text-red-400 px-3 py-1 rounded text-sm hover:bg-red-500/30 transition"
                    >
                      Delete Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {filteredOrders.length === 0 && (
            <p className="text-gray-400 text-center py-8">No orders found.</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default Orders;