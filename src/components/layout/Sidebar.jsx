 import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Package, Truck, Map, User, 
  TrendingUp, Award, Clock, Settings, HelpCircle,
  BarChart3, Route
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const role = user?.role;
  const [stats, setStats] = useState({
    todayDeliveries: 0,
    completionRate: 0,
    rating: 0
  });

  // Mock stats – replace with real API data later
  useEffect(() => {
    if (role === "driver") {
      setStats({
        todayDeliveries: 3,
        completionRate: 94,
        rating: 4.7
      });
    } else if (role === "admin") {
      setStats({
        todayDeliveries: 12,
        completionRate: 98,
        rating: 4.9
      });
    }
  }, [role]);

  // Main menu items – different for admin and driver
  const menuItems = [];

  if (role === "admin") {
    menuItems.push(
      { 
        name: "Dashboard", 
        path: "/dashboard", 
        icon: <LayoutDashboard size={20} />,
        description: "Overview & Analytics"
      },
      { 
        name: "Orders", 
        path: "/orders", 
        icon: <Package size={20} />,
        description: "Manage deliveries",
        badge: "12"
      },
      { 
        name: "Drivers", 
        path: "/drivers", 
        icon: <User size={20} />,
        description: "Driver management",
        badge: "5"
      },
      { 
        name: "Routes", 
        path: "/routes", 
        icon: <Route size={20} />,
        description: "Route optimization"
      }
    );
  } else if (role === "driver") {
    menuItems.push(
      { 
        name: "My Deliveries", 
        path: "/driver", 
        icon: <Truck size={20} />,
        description: "Active deliveries",
        badge: stats.todayDeliveries.toString()
      },
      { 
        name: "Routes", 
        path: "/routes", 
        icon: <Map size={20} />,
        description: "My route"
      }
    );
  }

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border-r border-white/20 flex flex-col">
      {/* Logo Section */}
      <div className="p-5 border-b border-white/20">
        <div className="flex items-center gap-2">
          <img
            src="/src/assets/logo.png"
            alt="EcoRoute"
            className="w-14 h-14 object-cover object-center rounded-lg shadow-lg bg-white/10 p-1"
          />
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              EcoRoute
            </h2>
            <p className="text-[10px] text-gray-500">v2.0.0</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-6 px-3 overflow-y-auto">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 px-3 mb-2">
            Main Menu
          </p>
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg border border-white/10"
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span className={`transition-transform group-hover:scale-110 ${location.pathname === item.path ? "text-blue-400" : ""}`}>
                  {item.icon}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.badge && (
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 group-hover:text-gray-400 transition">
                    {item.description}
                  </p>
                </div>
                {location.pathname === item.path && (
                  <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full" />
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Quick Stats - Driver Performance */}
        {role === "driver" && (
          <div className="mt-6 mx-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-blue-400" />
              <span className="text-xs font-medium text-white">Today's Stats</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Deliveries</span>
                  <span>{stats.todayDeliveries} / 8</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1">
                  <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${(stats.todayDeliveries / 8) * 100}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <div>
                  <p className="text-[10px] text-gray-500">Rating</p>
                  <p className="text-sm font-bold text-yellow-400">{stats.rating}⭐</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500">Completion</p>
                  <p className="text-sm font-bold text-green-400">{stats.completionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats - Admin Overview */}
        {role === "admin" && (
          <div className="mt-6 mx-3 p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={14} className="text-green-400" />
              <span className="text-xs font-medium text-white">System Health</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Active Orders</span>
                <span className="text-white font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Online Drivers</span>
                <span className="text-white font-medium">8/12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Optimization</span>
                <span className="text-green-400">96%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section – Settings & Help buttons only */}
      <div className="p-4 border-t border-white/20 space-y-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg border border-white/10"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <Settings size={20} />
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">Settings</div>
            <p className="text-[10px] text-gray-500">Account preferences</p>
          </div>
          {location.pathname === "/settings" && (
            <div className="absolute left-0 w-1 h-10 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full" />
          )}
        </NavLink>
        
        <NavLink
          to="/help"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg border border-white/10"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <HelpCircle size={20} />
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">Help & Support</div>
            <p className="text-[10px] text-gray-500">FAQs, guides, contact</p>
          </div>
          {location.pathname === "/help" && (
            <div className="absolute left-0 w-1 h-10 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full" />
          )}
        </NavLink>
        
        {/* Version Info */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-[10px] text-center text-gray-600">
            © 2024 EcoRoute Inc.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;