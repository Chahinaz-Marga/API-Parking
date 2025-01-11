import React, { useState, useEffect } from 'react';
import GoogleMapsLink from './googleMapsLink';

function SearchParking({ query, onResults, is24HoursFilter }) {
  const [parkings, setParkings] = useState([]); // donde se cargan los parkings de la lista
  const [filteredResults, setFilteredResults] = useState([]); 
  const [error, setError] = useState(null); 
  const [lastQuery, setLastQuery] = useState(''); // Última consulta para evitar repetición

  // Cargar datos del archivo JSON al iniciar
  useEffect(() => {
    const loadParkings = async () => {
      try {
        const response = await fetch('/data/parkingList.json'); 
        const data = await response.json();

        console.log('Datos cargados desde JSON:', data['@graph']); 
        setParkings(data['@graph']); // Guardar datos cargados
      } catch (err) {
        setError('Error cargando el archivo parkingList.json');
        console.error('Error cargando parkings:', err);
      }
    };

    loadParkings(); // Ejecutar carga de datos
  }, []); // Solo se ejecuta una vez al cargar el componente

  // Filtrar parkings según el término de búsqueda
  useEffect(() => {
    // Evitar repetición si la consulta no cambia
    if (query.trim() === lastQuery.trim()) return; // Salta si es la misma consulta
    setLastQuery(query); // Actualizar última consulta

    console.log('Query ingresada:', query); 

    // Si hay consulta
    if (query.trim()) {
      // Normalizar texto para comparaciones
      const normalizeText = (text) => {
        return text
          ?.toLowerCase()
          .trim()
          .replace(/[.,;()]/g, '') // Elimina puntuación
          .replace(/\s+/g, ' '); // Reemplaza múltiples espacios por uno solo
      };

      // Filtrar resultados
      const filtered = parkings.filter((parking) => {
        if (!parking.location || !parking.location.latitude || !parking.location.longitude) {
          console.warn('Parking sin ubicación válida:', parking);
          return false;
        }

        // Normalizar campos relevantes
        const title = normalizeText(parking.title) || '';
        const address = normalizeText(parking.address?.['street-address']) || '';
        const districtId = parking.address?.district?.['@id'] || '';
        const districtName = normalizeText(districtId.split('/').pop()) || '';

        // filtro de horario 24 horas si está activado
        const is24Hours = parking.organization.schedule?.includes('24 horas');
        if (is24HoursFilter && !is24Hours) {
          return false; 
        }
        
        return (
          title.includes(normalizeText(query)) || 
          address.includes(normalizeText(query)) || 
          districtName.includes(normalizeText(query))
        );
      });

      console.log('Resultados filtrados:', filtered); 

      // Actualizar resultados
      setFilteredResults(filtered);
      onResults(filtered); // pasa

      // marcadores en el mapa
      const markers = filtered
        .filter((parking) => parking.location && parking.location.latitude && parking.location.longitude) // Filtrar datos válidos
        .map((parking) => parking);
      
    } else {
      console.log('Consulta vacía. Limpiando resultados.');
      setFilteredResults([]); 
      onResults([]); 
      
    }
  }, [query, parkings, onResults, lastQuery, is24HoursFilter]); 

  
  return (
    <div>
      <h2>Listado de aparcamientos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {filteredResults.length === 0 ? (
        <p>No se encontraron resultados.</p>
      ) : (
        <ul className="list-group">
          {filteredResults.map((parking) => (
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

export default SearchParking;
