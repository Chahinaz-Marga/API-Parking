//import React from 'react';
//import ReactDOM from 'react-dom/client';
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

function MapWithPlaceholder() {
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
      <Puntero/>
    </MapContainer>
  );
}

//const root = ReactDOM.createRoot(document.getElementById('root'));
//root.render(<MapWithPlaceholder />);

export default MapWithPlaceholder;