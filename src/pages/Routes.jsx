import React, { useState } from "react";
import GlassCard from "../components/common/GlassCard";
import MapView from "../components/map/MapView";
import { optimizeRoutes } from "../services/optimizationService";

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const data = await optimizeRoutes();
      // Expecting backend to return an array of { driverId, route: [[lat, lng], ...] }
      setRoutes(data);
    } catch (error) {
      console.error("Optimization failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Route Optimization</h1>
      
      <GlassCard className="flex items-center justify-between">
        <div>
          <p className="text-slate-300">Run the optimization algorithm to assign orders to drivers.</p>
        </div>
        <button
          onClick={handleOptimize}
          disabled={loading}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            loading 
            ? "bg-slate-700 cursor-not-allowed" 
            : "bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/20"
          }`}
        >
          {loading ? "Optimizing..." : "Optimize Now"}
        </button>
      </GlassCard>

      <GlassCard className="h-[600px] p-0 overflow-hidden">
        <MapView routes={routes} />
      </GlassCard>
    </div>
  );
};

export default RoutesPage;