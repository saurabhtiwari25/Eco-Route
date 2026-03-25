import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white/10 backdrop-blur-md border-r border-white/10 p-4">
      <h2 className="text-xl font-bold mb-6">EcoRoute</h2>

      <nav className="flex flex-col gap-3">
        <Link to="/" className="hover:bg-white/20 p-2 rounded">
          Dashboard
        </Link>

        <Link to="/orders" className="hover:bg-white/20 p-2 rounded">
          Orders
        </Link>

        <Link to="/drivers" className="hover:bg-white/20 p-2 rounded">
          Drivers
        </Link>

        <Link to="/routes" className="hover:bg-white/20 p-2 rounded">
          Routes
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;