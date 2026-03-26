import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isLoginPage = location.pathname === "/";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const showSidebar = !isLoginPage && user;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {showSidebar && (
        <>
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={toggleSidebar}
            />
          )}
          <div
            className={`
              fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-40
              md:relative md:translate-x-0
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <Sidebar />
          </div>
        </>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        {showSidebar && (
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        )}
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;