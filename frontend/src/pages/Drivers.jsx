import { useEffect, useState } from "react";
import api from "../api/axios";
import DriverForm from "../components/DriverForm";
import DriverCard from "../components/DriverCard";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);

  const load = async () => {
    const res = await api.get("/drivers");
    setDrivers(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
  <>
    {/* CREATE DRIVER */}
    <div className="card">
      <h2>Create Driver</h2>
      <DriverForm onCreated={load} />
    </div>

    {/* DRIVERS LIST */}
    <div className="card">
      <h2>Drivers</h2>

      {drivers.length === 0 ? (
        <p>No drivers available</p>
      ) : (
        <div className="driver-grid">
          {drivers.map((d) => (
            <DriverCard key={d._id} driver={d} />
          ))}
        </div>
      )}
    </div>
  </>
);
}