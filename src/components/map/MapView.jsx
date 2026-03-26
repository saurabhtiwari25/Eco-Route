import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ orders = [], routes = [], center = [51.505, -0.09], zoom = 13 }) => {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%', borderRadius: '0.5rem' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {orders.map((order) => (
        <Marker key={order.id} position={[order.pickup_lat, order.pickup_lng]}>
          <Popup>
            Order #{order.id}<br />
            Customer: {order.customer}
          </Popup>
        </Marker>
      ))}
      {routes.map((route) => (
        <Polyline
          key={route.id}
          positions={route.coordinates}
          color="blue"
          weight={3}
          opacity={0.7}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
 