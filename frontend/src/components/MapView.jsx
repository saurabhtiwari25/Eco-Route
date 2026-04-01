import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import api from "../api/axios";
import RouteDetails from "./RouteDetails";
import LiveMapLayer from "./LiveMapLayer";

const colors = ["red", "blue", "green", "purple", "orange", "black"];

/* ✅ CUSTOM ICONS */
const orderIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [25, 25],
});

const driverIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
  iconSize: [30, 30],
});

/* 🔢 NUMBERED ICON */
const createNumberIcon = (num, color) =>
  new L.DivIcon({
    className: "",
    html: `
      <div style="
        background:${color};
        color:white;
        border-radius:50%;
        width:24px;
        height:24px;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:12px;
        font-weight:bold;
        border:2px solid white;
      ">
        ${num}
      </div>
    `,
  });

export default function MapView({ showOrders, showDrivers, showRoutes }) {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [liveRoutes, setLiveRoutes] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    const o = await api.get("/orders");
    const d = await api.get("/drivers");
    setOrders(o.data);
    setDrivers(d.data);
  };

  useEffect(() => {
    load();
  }, []);

  /* ✅ LISTEN FOR OPTIMIZATION RESULT */
  useEffect(() => {
    const handler = (e) => {
      const { routes, drivers } = e.detail;

      const enriched = routes.map((r, i) => ({
        ...r,
        start_location: drivers[i]?.start_location,
      }));

      setRoutes(routes);
      setLiveRoutes(enriched);
    };

    window.addEventListener("routesUpdated", handler);
    return () => window.removeEventListener("routesUpdated", handler);
  }, []);

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer center={[20, 77]} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🔴 Orders */}
        {showOrders &&
          orders.map((o) => (
            <Marker key={o._id} position={o.location} icon={orderIcon}>
              <Popup>Order | Priority: {o.priority}</Popup>
            </Marker>
          ))}

        {/* 🔵 Drivers */}
        {showDrivers &&
          drivers.map((d) => (
            <Marker key={d._id} position={d.start_location} icon={driverIcon}>
              <Popup>Driver | Capacity: {d.capacity}</Popup>
            </Marker>
          ))}

        {/* 🟢 Routes + Numbered Stops */}
        {showRoutes &&
          routes.map((r, i) => {
            const coords = r.route.map((o) => o.location);
            const color = colors[i % colors.length];

            return (
              <>
                {/* ROUTE LINE */}
                <Polyline
                  key={i}
                  positions={coords}
                  pathOptions={{
                    color,
                    weight: 5,
                    opacity: 0.8,
                  }}
                  eventHandlers={{
                    click: () => setSelected(r),
                    mouseover: (e) => e.target.setStyle({ weight: 7 }),
                    mouseout: (e) => e.target.setStyle({ weight: 5 }),
                  }}
                />

                {/* NUMBERED STOPS */}
                {r.route.map((o, idx) => (
                  <Marker
                    key={o._id}
                    position={o.location}
                    icon={createNumberIcon(idx + 1, color)}
                  >
                    <Popup>
                      Stop {idx + 1} <br />
                      Priority: {o.priority}
                    </Popup>
                  </Marker>
                ))}
              </>
            );
          })}

        {/* 🚚 LIVE SIMULATION */}
        <LiveMapLayer routes={liveRoutes} />
      </MapContainer>

      {/* 🧭 LEGEND */}
      {showRoutes && routes.length > 0 && (
        <div className="map-legend">
          <h4>Routes</h4>
          {routes.map((r, i) => (
            <div key={i} className="legend-item">
              <span
                className="legend-color"
                style={{ background: colors[i % colors.length] }}
              ></span>
              Driver {i + 1}
            </div>
          ))}
        </div>
      )}

      {/* 📊 ROUTE DETAILS */}
      {selected && (
        <RouteDetails route={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}