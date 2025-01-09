import React, { useState, useEffect } from 'react';

function FilterParkingsNear({ center, radius, onFilter }) {
  const [parkings, setParkings] = useState([]); // Estado para almacenar los parkings
  const [filteredParkings, setFilteredParkings] = useState([]); // Estado para almacenar parkings filtrados
  const earthRadiusKm = 6371;

  useEffect(() => {
    const loadParkings = async () => {
      try {
        const response = await fetch('/data/parkingList.json');
        const data = await response.json();
        console.log('Datos cargados desde JSON:', data['@graph']);
        setParkings(data['@graph']);
      } catch (err) {
        console.error('Error cargando parkings:', err);
      }
    };

    loadParkings();
  }, []); // Solo se ejecuta una vez al montar el componente

  useEffect(() => {
    if (parkings.length > 0 && center.lat && center.lng) {
      const filtered = parkings.filter((parking) => {
        const parkingLat = parking.location?.latitude;
        const parkingLng = parking.location?.longitude;

        if (!parkingLat || !parkingLng) {
          return false; // Excluir parkings sin coordenadas válidas
        }

        const dLat = DegreesToRadians(parkingLat - center.lat);
        const dLng = DegreesToRadians(parkingLng - center.lng);

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(DegreesToRadians(center.lat)) *
            Math.cos(DegreesToRadians(parkingLat)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadiusKm * c;

        return distance <= radius; // Incluir el parking si está dentro del radio
      });

      console.log('Parkings filtrados antes de notificar:', filtered);

      // Solo actualiza el estado si los datos cambian
      
      if (JSON.stringify(filtered) !== JSON.stringify(filteredParkings)) {
        setFilteredParkings(filtered);
        onFilter(filtered); // Notificar cambios solo si hay una diferencia real
      }
    }
  }, [parkings, center, radius, onFilter]);

  function DegreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  

  return (
    <div>
      <h2>Listado de aparcamientos</h2>
      {filteredParkings.length === 0 ? (
        <p>No se encontraron resultados.</p>
      ) : (
        <ul className="list-group">
          {filteredParkings.map((parking) => (
            <li key={parking['@id']} className="list-group-item">
              <strong>{parking.title}</strong>
              <p>Dirección: {parking.address['street-address']}</p>
              <p>Distrito: {parking.address.district['@id'].split('/').pop()}</p>
              <p>Horario: {parking.organization.schedule || 'No disponible'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilterParkingsNear;
