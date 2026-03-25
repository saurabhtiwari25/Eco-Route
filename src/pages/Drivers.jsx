import { useEffect, useState } from "react";
import { getDrivers, createDriver } from "../services/driverService";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    currentLatitude: "",
    currentLongitude: "",
  });

  // Fetch drivers
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (err) {
      console.error("Error fetching drivers", err);
    }
  };

  // ➕ Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ➕ Create driver
  const handleSubmit = async () => {
    try {
      await createDriver({
        name: form.name,
        currentLatitude: parseFloat(form.currentLatitude),
        currentLongitude: parseFloat(form.currentLongitude),
      });

      setForm({
        name: "",
        currentLatitude: "",
        currentLongitude: "",
      });

      fetchDrivers(); // refresh
    } catch (err) {
      console.error("Error creating driver", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Drivers</h1>

      {/* ➕ Add Driver */}
      <div className="bg-white/10 p-4 rounded-xl mb-6">
        <h2 className="mb-2 font-semibold">Add Driver</h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="p-2 mr-2 rounded bg-white/20"
        />

        <input
          name="currentLatitude"
          placeholder="Latitude"
          value={form.currentLatitude}
          onChange={handleChange}
          className="p-2 mr-2 rounded bg-white/20"
        />

        <input
          name="currentLongitude"
          placeholder="Longitude"
          value={form.currentLongitude}
          onChange={handleChange}
          className="p-2 mr-2 rounded bg-white/20"
        />

        <button
          onClick={handleSubmit}
          className="bg-green-500 px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Drivers List */}
      <div className="space-y-2">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-white/10 p-3 rounded-lg"
          >
            <div><strong>ID:</strong> {driver.id}</div>
            <div><strong>Name:</strong> {driver.name}</div>
            <div>
              <strong>Location:</strong> {driver.currentLatitude}, {driver.currentLongitude}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Drivers;