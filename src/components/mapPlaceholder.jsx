import { MapContainer, TileLayer, useMap, GeoJSON, Circle } from 'react-leaflet';
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

//esta función ajusta el mapa a los resultados de parkins o de places
function AdjustMapBounds({ parkings, googleResult, searchStage }) { 
  const map = useMap();

  useEffect(() => {
    if (searchStage === 'parking' && parkings.length > 0) {
      const bounds = parkings
      .filter((parking) => parking.location && typeof parking.location.latitude === 'number' && typeof parking.location.longitude === 'number')
      .map((parking) => [parking.location.latitude, parking.location.longitude]);
      
      if (bounds.length > 0) {
        map.fitBounds(bounds);
      }
       
    } else if (searchStage === 'places' && googleResult) {
       const parkingBounds = parkings
       .filter((parking) => parking.location && parking.location.latitude && parking.location.longitude)
       .map((parking) => [parking.location.latitude, parking.location.longitude]);

     const allBounds = [
       [googleResult.lat, googleResult.lng], 
       ...parkingBounds, 
     ];

     if (allBounds.length > 1) {
       map.fitBounds(allBounds, { padding: [50, 50] });
     } else if (allBounds.length === 1) {
       map.setView([googleResult.lat, googleResult.lng], 15);
     }
    }
  }, [map, parkings, googleResult, searchStage]);
  
  
  return null;
}


function MapWithPlaceholder({ parkings, googleResult, searchStage, searchRadius, onMarkerClick }) {
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
      <AdjustMapBounds 
        parkings={parkings} 
        googleResult={googleResult}
        searchStage={searchStage}
      />

      {googleResult && googleResult.lat && googleResult.lng && (
        <Circle
          center={[googleResult.lat, googleResult.lng]}
          radius={searchRadius * 1000} // Convertir km a metros
          pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.2 }}
        />
      )}

      {parkings.map((parking) => {
        const lat = parking.location?.latitude; 
        const lng = parking.location?.longitude;

        if (!parking.location || typeof parking.location.latitude !== 'number' || typeof parking.location.longitude !== 'number') {
          console.warn('Parking sin ubicación válida o coordenadas incorrectas:', parking);
          return null;
        }

        return (
          <Pointer 
            key={parking["id"]}
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