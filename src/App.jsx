import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Drivers from "./pages/Drivers";
import RoutesPage from "./pages/Routes";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        
        <Sidebar />

        <div className="flex-1 flex flex-col">
          
        <Navbar />

          <div className="p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/routes" element={<RoutesPage />} />
            </Routes>
          </div>

        </div>
      </div>
    </Router>
  );
}

export default App;
