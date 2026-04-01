import { useEffect, useRef, useState } from "react";

export default function useSimulation(routes) {
  const [positions, setPositions] = useState({});
  const wsRef = useRef(null);

  useEffect(() => {
    if (!routes || routes.length === 0) return;

    const ws = new WebSocket("ws://localhost:8000/ws/simulate");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ routes }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setPositions((prev) => ({
        ...prev,
        [data.driver_index]: data.position
      }));
    };

    return () => ws.close();
  }, [routes]);

  return positions;
}