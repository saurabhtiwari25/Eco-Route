import { Marker, Popup } from "react-leaflet";
import useSimulation from "../hooks/useSimulation";

export default function LiveMapLayer({ routes }) {
  const positions = useSimulation(routes);

  return (
    <>
      {Object.entries(positions).map(([idx, pos]) => (
        <Marker key={idx} position={pos}>
          <Popup>Driver {idx} (Live)</Popup>
        </Marker>
      ))}
    </>
  );
}