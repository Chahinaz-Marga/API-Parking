import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Pointer from './pointer';
import { useEffect } from 'react';

function MapPlaceholder() {
  return (
    <p>
      Map of Madrid.{' '}
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}

function AdjustMapBounds({ parkings }) {
  const map = useMap();

  useEffect(() => {
    if (parkings.length > 0) {
      const bounds = parkings.map((parking) => [parking.location.latitude, parking.location.longitude]);
      map.fitBounds(bounds); 
    }
  }, [map, parkings]);
  
  return null;
}

function MapWithPlaceholder({ parkings }) {
  return (
    <MapContainer
      center={[40.4168, -3.7038]}
      zoom={15}
      scrollWheelZoom={false}
      placeholder={<MapPlaceholder />}
      className="leaflet-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AdjustMapBounds parkings={parkings} />

      {parkings.map((parking) => (
        <Pointer 
          key={parking.id}
          lat={parking.location.latitude} 
          lng={parking.location.longitude} 
          name={parking.title}
          onClick={() => onMarkerClick(parking)}
        />
      ))}
    </MapContainer>
  );
}

export default MapWithPlaceholder;