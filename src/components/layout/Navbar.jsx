 import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, X, LogOut, User, Settings, Bell, 
  ChevronDown, Home, Truck, Shield, Moon, Sun,
  Activity, Clock, Award, HelpCircle, XCircle, CheckCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: "New order assigned", 
      message: "Order ORD-005 has been assigned to you", 
      time: "5 min ago", 
      read: false,
      type: "info"
    },
    { 
      id: 2, 
      title: "Route optimized", 
      message: "Your delivery route has been optimized for faster delivery", 
      time: "15 min ago", 
      read: false,
      type: "success"
    },
    { 
      id: 3, 
      title: "Delivery completed", 
      message: "Order ORD-002 was delivered successfully", 
      time: "1 hour ago", 
      read: false,
      type: "success"
    },
    { 
      id: 4, 
      title: "Rating received", 
      message: "You received a 5-star rating from customer!", 
      time: "2 hours ago", 
      read: true,
      type: "rating"
    },
  ]);
  
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case "success":
        return <CheckCircle size={14} className="text-green-400" />;
      case "info":
        return <Bell size={14} className="text-blue-400" />;
      case "rating":
        return <Award size={14} className="text-yellow-400" />;
      default:
        return <Bell size={14} className="text-gray-400" />;
    }
  };

  if (!user) return null;

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/orders": "Order Management",
    "/drivers": "Driver Management",
    "/routes": "Route Optimization",
    "/driver": "My Deliveries",
    "/settings": "Settings",
    "/help": "Help & Support",
  };

  const currentPageTitle = pageTitles[location.pathname] || "EcoRoute";

  return (
    <nav className="sticky top-0 z-30 w-full bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="md:hidden text-gray-300 hover:text-white focus:outline-none transition-all hover:scale-110"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link 
              to={user.role === "admin" ? "/dashboard" : "/driver"} 
              className="flex items-center gap-2 group"
            >
              <img
                src="/src/assets/logo.png"
                alt="EcoRoute"
                className="w-14 h-14 object-cover object-center rounded-lg shadow-lg bg-white/10 p-1"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  EcoRoute
                </h1>
                <p className="text-[10px] text-gray-400 -mt-1">Intelligent Delivery</p>
              </div>
            </Link>
            
            {/* Page Title - Desktop */}
            <div className="hidden md:block ml-4 pl-4 border-l border-white/20">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-blue-400" />
                <span className="text-gray-300 text-sm font-medium">{currentPageTitle}</span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Time Display */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
              <Clock size={14} className="text-gray-400" />
              <div className="text-sm text-gray-300">
                <span className="font-mono">{formatTime()}</span>
                <span className="text-xs text-gray-500 ml-1">{formatDate()}</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsDropdownOpen(false);
                }}
                className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all hover:scale-105"
              >
                <Bell size={20} className="text-gray-200" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700 py-2 z-50 animate-slide-down">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-semibold text-white">Notifications</h3>
                        <p className="text-xs text-gray-400">You have {unreadCount} unread notifications</p>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-400 hover:text-blue-300 transition"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell size={32} className="text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                            !notif.read ? "bg-blue-500/20" : ""
                          }`}
                          onClick={() => markAsRead(notif.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notif.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-white">{notif.title}</p>
                                {!notif.read && (
                                  <span className="w-2 h-2 bg-blue-400 rounded-full" />
                                )}
                              </div>
                              <p className="text-xs text-gray-300">{notif.message}</p>
                              <p className="text-[10px] text-gray-500 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-700">
                    <button className="text-xs text-blue-400 hover:text-blue-300 w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2 focus:outline-none group p-1 rounded-lg hover:bg-white/10 transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-white group-hover:text-blue-300 transition">
                    {user.name || "User"}
                  </div>
                  <div className="text-xs text-gray-400 capitalize flex items-center gap-1">
                    {user.role === "admin" ? <Shield size={10} /> : <Truck size={10} />}
                    {user.role}
                  </div>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700 py-2 z-50 animate-slide-down">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-xs text-gray-400 capitalize flex items-center gap-1">
                          {user.role === "admin" ? <Shield size={10} /> : <Truck size={10} />}
                          {user.role} Portal
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      to={user.role === "admin" ? "/dashboard" : "/driver"}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Home size={16} />
                      Dashboard
                    </Link>
                    <Link
                      to="/routes"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Activity size={16} />
                      Active Routes
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <Link
                      to="/help"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <HelpCircle size={16} />
                      Help & Support
                    </Link>
                    <div className="border-t border-gray-700 my-2"></div>
                    <div className="px-4 py-2">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span>Performance</span>
                        <span className="flex items-center gap-1"><Award size={12} /> 4.8 ⭐</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div className="bg-green-500 h-1 rounded-full" style={{ width: "96%" }} />
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-gray-700"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Page Title Bar */}
      <div className="md:hidden px-4 py-2 bg-white/5 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-blue-400" />
          <span className="text-gray-300 text-sm">{currentPageTitle}</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;