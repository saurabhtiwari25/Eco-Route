export default function RouteDetails({ route, onClose }) {
  return (
    <div style={{
      position: "absolute",
      bottom: 20,
      left: 20,
      background: "white",
      padding: 15,
      zIndex: 1000,
      width: "300px"
    }}>
      <button onClick={onClose}>Close</button>
      <h3>Route Details</h3>
      <p>Driver Index: {route.driver_index}</p>
      <p>Before Distance: {route.before_distance.toFixed(2)} km</p>
      <p>After Distance: {route.after_distance.toFixed(2)} km</p>
      <p>ETA: {route.eta_minutes.toFixed(2)} min</p>

      <ul>
        {route.route.map((o, idx) => (
          <li key={idx}>
            Stop {idx + 1}: [{o.location.join(", ")}]
          </li>
        ))}
      </ul>
    </div>
  );
}