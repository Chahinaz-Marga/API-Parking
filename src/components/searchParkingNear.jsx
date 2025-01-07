import React, { useEffect, useState } from 'react';
import { filterParkingsByDistance } from '../components/filterParkings';

function SearchParkingNear({ parkings, userLocation, radius, onMarkersUpdate }) {
  const [filteredParkings, setFilteredParkings] = useState([]);

  useEffect(() => {
    if (userLocation && radius && parkings) {
      const nearbyParkings = filterParkingsByDistance(
        parkings,
        userLocation.lat,
        userLocation.lng,
        radius
      );
      setFilteredParkings(nearbyParkings);
      onMarkersUpdate(nearbyParkings); // Actualiza los marcadores
    }
  }, [parkings, userLocation, radius, onMarkersUpdate]);

  return (
    <div>
      <h4>Parkings dentro de {radius} km</h4>
      <ul>
        {filteredParkings.map((parking) => (
          <li key={parking.id}>{parking.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchParkingNear;
