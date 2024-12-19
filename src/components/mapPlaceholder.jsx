import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Pointer from './pointer';
import { useEffect, useState } from 'react';
import axios from 'axios';


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



function MapWithPlaceholder({ parkings, onMarkerClick }) {
  const [zbeData, setZBEData] = useState(null);

  useEffect(() => {
    const fetchZBEData = async () => {
      try {
        const response = await axios.get('/zbe.json'); 
        setZBEData(response.data); 
      } catch (error) {
        console.error('Error al cargar los datos de la ZBE:', error);
      }
    };

    fetchZBEData();
  }, []);

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

      {zbeData && (
        <GeoJSON
          data={zbeData}
          style={{
            color: 'red',
            weight: 2,
            fillColor: 'red',
            fillOpacity: 0.2,
          }}
        />
      )}

    </MapContainer>
  );
}

export default MapWithPlaceholder;