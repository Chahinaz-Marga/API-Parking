import React, { useState, useEffect } from 'react';
import GoogleMapsLink from './googleMapsLink';

function FilterParkingsNear({ center, radius, onFilter, is24HoursFilter }) {
  const [parkings, setParkings] = useState([]); // Estado para almacenar todos los parkings
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
  }, []); // Solo cuando carga

  useEffect(() => {
    if (parkings.length > 0 && center.lat && center.lng) {
      const filtered = parkings.filter((parking) => {
        const parkingLat = parking.location?.latitude;
        const parkingLng = parking.location?.longitude;
        const is24Hours = parking.organization.schedule?.includes('24 horas');
      
        if (!parkingLat || !parkingLng) {
          return false; // Excluir parkings sin coordenadas válidas que luego da error
        }

        if (is24HoursFilter && !is24Hours) {
          return false; // Excluir parkings que no son 24 horas si filtro
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

        return distance <= radius; 
      });

      console.log('Parkings filtrados antes de notificar:', filtered);

      // Solo actualiza el estado si los datos cambian que si no se renderiza cada 2x3      
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
            <div className="d-flex justify-content-between align-items-center">
              <strong>{parking.title}</strong>
              <GoogleMapsLink address={parking.address['street-address']} />
            </div>
            <div style={{ marginTop: '5px', marginLeft: '15px', fontSize: '0.9em', color: '#555' }}> 
                <p className="mb-1"><strong>Dirección:</strong> {parking.address['street-address']}</p>
                <p className="mb-1"><strong>Distrito:</strong> {parking.address.district['@id'].split('/').pop()}</p>
                <p className="mb-1"><strong>Horario:</strong> {parking.organization.schedule || 'No disponible'}</p>
              </div>                
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilterParkingsNear;
