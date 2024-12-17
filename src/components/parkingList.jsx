import React, { useEffect, useState } from 'react';
import { fetchParkings } from '../services/api';
import SearchBar from './searchBar';
import MapWithPlaceholder from './mapPlaceholder';
import GoogleMapsLink from './googleMapsLink';

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

  const handleSearch = (searchTerm) => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = parkings.filter((parking) => {
      const titleMatch = parking.title?.toLowerCase().includes(lowercasedTerm) || false;
      const addressMatch = parking.address?.['street-address']?.toLowerCase().includes(lowercasedTerm) || false;
      const districtMatch = parking.address?.district?.['@id']?.split('/').pop().toLowerCase().includes(lowercasedTerm) || false;
      return titleMatch || addressMatch || districtMatch;
    });
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
                <GoogleMapsLink parkings={parking.address["street-address"]} />
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
