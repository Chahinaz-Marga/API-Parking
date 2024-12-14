import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Puntero from './puntero';

function MapPlaceholder() {
  return (
    <p>
      Map of Madrid.{' '}
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}

function MapWithPlaceholder({ parkings }) {
  return (
    <MapContainer
      center={[40.4168, -3.7038]}
      zoom={13}
      scrollWheelZoom={false}
      placeholder={<MapPlaceholder />}
      className="leaflet-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
     
      {parkings.map((parking) => <Puntero lat={parking.location.latitude} lng={parking.location.longitude} />)}

      <Puntero lat={40.4168} lng={-3.7038}/> 
    </MapContainer>
  );
}
//en <MapConainer> hay que dibujar n punteros <Puntero>
export default MapWithPlaceholder;