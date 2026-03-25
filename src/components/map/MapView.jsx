import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const colors = ["red", "blue", "green", "yellow", "purple"];

const MapView = ({ routes }) => {
  const defaultCenter = [12.9716, 77.5946];

  const center =
    routes.length > 0 && routes[0].route.length > 0
      ? routes[0].route[0]
      : defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {routes.map((driverRoute, index) => {
        const color = colors[index % colors.length];

        return (
          <div key={driverRoute.driverId}>
            {/* Driver Start */}
            {driverRoute.route.length > 0 && (
              <Marker position={driverRoute.route[0]}>
                <Popup>Driver {driverRoute.driverId}</Popup>
              </Marker>
            )}

            {/* Stops */}
            {driverRoute.route.map((point, i) => (
              <Marker key={i} position={point}>
                <Popup>
                  Driver {driverRoute.driverId} - Stop {i + 1}
                </Popup>
              </Marker>
            ))}

            {/* Route Line */}
            <Polyline
              positions={driverRoute.route}
              pathOptions={{ color }}
            />
          </div>
        );
      })}
    </MapContainer>
  );
};

export default MapView;