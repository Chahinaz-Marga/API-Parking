import React, { useEffect, useState } from 'react';
import { fetchParkings } from '../services/api';
import SearchBar from './searchBar';
import MapWithPlaceholder from './mapPlaceholder';

function ParkingList() {
  const [parkings, setParkings] = useState([]);
  const [filteredParkings, setFilteredParkings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getParkings = async () => {
      try {
        const data = await fetchParkings();
        setParkings(data);
        setFilteredParkings(data); 
      } catch (error) {
        setError('Error loading parkings');
        console.error('Error en ParkingList:', error);
      }
    };

    getParkings();
  }, []);

  const handleSearch = (searchText) => {
    const filtered = parkings.filter((parking) =>
      parking.title.toLowerCase().includes(searchText.toLowerCase()) ||
      parking.address.district['@id']
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    setFilteredParkings(filtered);
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="d-flex gap-1 container mt-4">
      <div>
        <h2>Listado de Aparcamientos</h2>
        <SearchBar onSearch={handleSearch} />
        {filteredParkings.length === 0 ? (
          <p>No se encontraron resultados.</p>
        ) : (
          <ul className="list-group">
            {filteredParkings.map((parking) => (
              <li key={parking.id} className="list-group-item">
                <strong>{parking.title}</strong>
                <p>Dirección: {parking.address['street-address']}</p>
                <p>Distrito: {parking.address.district['@id'].split('/').pop()}</p>
                <p>Horario: {parking.organization.schedule || 'No disponible'}</p>
              </li>
            ))}
          </ul>
        )}                            
      </div>
      
      <MapWithPlaceholder parkings={filteredParkings} />
    </div>
  );
}

export default ParkingList;
