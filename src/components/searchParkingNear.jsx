import React, { useEffect, useState } from 'react';

const SearchParkingNear = ({ googleResult, parkings, onMarkersUpdate }) => {
  const [nearbyParkings, setNearbyParkings] = useState([]);
  const radius = 2000; // Radio en metros (2 km)

  // Función para calcular la distancia entre dos puntos geográficos
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin(Δλ / 2) *
        Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  };

  // Buscar parkings cercanos
  useEffect(() => {
    if (googleResult && parkings.length > 0) {
      const nearby = parkings.filter((parking) => {
        const distance = getDistance(
          googleResult.lat,
          googleResult.lng,
          parking.location.latitude,
          parking.location.longitude
        );
        return distance <= radius; // Parkings dentro del radio de 2 km
      });

      console.log('Parkings cercanos:', nearby);
      setNearbyParkings(nearby);

      // Actualizar marcadores para el mapa
      const markers = [
        {
          id: 'googleResult',
          lat: googleResult.lat,
          lng: googleResult.lng,
          color: 'red', // Marcador rojo para el lugar buscado
        },
        ...nearby.map((parking) => ({
          id: parking['@id'],
          lat: parking.location.latitude,
          lng: parking.location.longitude,
          color: 'blue', // Marcador azul para parkings cercanos
        })),
      ];

      onMarkersUpdate(markers);
    }
  }, [googleResult, parkings, onMarkersUpdate]);

  return (
    <div>
      
      <ul>
        {nearbyParkings.map((parking) => (
          <li key={parking['@id']}>{parking.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchParkingNear;
