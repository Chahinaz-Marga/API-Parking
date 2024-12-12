import React, { useEffect, useState } from 'react';
import { fetchParkings } from '../services/api';

function ParkingList() {
  const [parkings, setParkings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getParkings = async () => {
      try {
        const data = await fetchParkings();
        console.log('Parkings obtenidos:', data); 
        setParkings(data);
      } catch (error) {
        console.error('Error en ParkingList:', error);
        setError('Error loading parkings');
      }
    };

    getParkings();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Listado de Aparcamientos</h2>
      <ul className="list-group">
        {parkings.map((parking) => (
          <li key={parking.id} className="list-group-item">
            <strong>{parking.title}</strong>
            <p>Dirección: {parking.address['street-address']}</p>
            <p>Distrito: {parking.address.district['@id'].split('/').pop()}</p>
            <p>Horario: {parking.organization.schedule || 'No disponible'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ParkingList;
