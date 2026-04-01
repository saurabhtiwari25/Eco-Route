import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Analytics() {
  const [data, setData] = useState(null);

  const load = async () => {
    const res = await api.get("/assignments/latest");
    setData(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  if (!data) return <p>Loading...</p>;

  const metrics = data.metrics;

  return (
    <div>
      <h1>Analytics</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Before Distance</th>
            <th>After Distance</th>
            <th>Efficiency Gain</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{metrics.before_distance.toFixed(2)} km</td>
            <td>{metrics.after_distance.toFixed(2)} km</td>
            <td>{(metrics.efficiency_gain * 100).toFixed(2)} %</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}