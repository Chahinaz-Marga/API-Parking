import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Pointer from './pointer';
import { useEffect, useState } from 'react';
import axios from 'axios';
import RedPointer from './redPointer';


function MapPlaceholder() {
  return (
    <p>
      Map of Madrid.{' '}
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}

function AdjustMapBounds({ parkings, googleResult }) {
  const map = useMap();

  useEffect(() => {
    if (parkings.length > 0) {
      const bounds = parkings
      .filter((parking) => parking.location && typeof parking.location.latitude === 'number' && typeof parking.location.longitude === 'number')
      .map((parking) => [parking.location.latitude, parking.location.longitude]);
      
      if (bounds.length > 0) {
        map.fitBounds(bounds);
      }
       
    } else if (googleResult  && typeof googleResult.lat === 'number' && typeof googleResult.lng === 'number') {
      map.setView([googleResult.lat, googleResult.lng], 15); // Vista para Google Places
    }
  }, [map, parkings, googleResult]);
  
  
  return null;
}


function MapWithPlaceholder({ parkings, googleResult, onMarkerClick }) {
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
      zoom={13}
      scrollWheelZoom={true}
      placeholder={<MapPlaceholder />}
      className="leaflet-container"
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AdjustMapBounds parkings={parkings} googleResult={googleResult} />

      {parkings.map((parking) => {
        // Validar que 'location', 'latitude' y 'longitude' existan
        const lat = parking.location?.latitude; 
        const lng = parking.location?.longitude;

        if (!parking.location || typeof parking.location.latitude !== 'number' || typeof parking.location.longitude !== 'number') {
          console.warn('Parking sin ubicación válida o coordenadas incorrectas:', parking);
          return null;
        }

        return (
          <Pointer 
            key={parking.id}
            lat={lat}
            lng={lng}
            name={parking.title}
            onClick={() => onMarkerClick(parking)}
          />
        );
      })}


      {googleResult && googleResult.lat && googleResult.lng && (
        <RedPointer 
          lat={googleResult.lat} 
          lng={googleResult.lng} 
          name={googleResult.name} 
        />
      )}

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