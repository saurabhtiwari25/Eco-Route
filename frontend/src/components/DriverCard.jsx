export default function DriverCard({ driver }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "10px"
    }}>
      <h3>Driver</h3>
      <p>Capacity: {driver.capacity}</p>
      <p>Start: [{driver.start_location.join(", ")}]</p>
    </div>
  );
}