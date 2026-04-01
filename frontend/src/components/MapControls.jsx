export default function MapControls({ onOptimize }) {
  return (
    <div style={{
      position: "absolute",
      top: 20,
      right: 20,
      background: "#fff",
      padding: 10,
      zIndex: 1000
    }}>
      <button onClick={onOptimize}>Run Optimization</button>
    </div>
  );
}