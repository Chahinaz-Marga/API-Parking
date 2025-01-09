import React, { useState, useEffect } from 'react';
import GoogleMapsLink from './googleMapsLink';

function SearchParking({ query, onResults }) {
  // Estados
  const [parkings, setParkings] = useState([]); // Datos cargados
  const [filteredResults, setFilteredResults] = useState([]); // Resultados filtrados
  const [error, setError] = useState(null); // Estado de error
  const [lastQuery, setLastQuery] = useState(''); // Última consulta para evitar repetición

  // Cargar datos del archivo JSON al iniciar
  useEffect(() => {
    const loadParkings = async () => {
      try {
        const response = await fetch('/data/parkingList.json'); // Ruta al archivo JSON
        const data = await response.json();

        console.log('Datos cargados desde JSON:', data['@graph']); // Depuración
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

    console.log('Query ingresada:', query); // Depuración

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
        // Verificar que las coordenadas existan
        if (!parking.location || !parking.location.latitude || !parking.location.longitude) {
          console.warn('Parking sin ubicación válida:', parking);
          return false;
        }

        // Normalizar campos relevantes
        const title = normalizeText(parking.title) || '';
        const address = normalizeText(parking.address?.['street-address']) || '';
        const districtId = parking.address?.district?.['@id'] || '';
        const districtName = normalizeText(districtId.split('/').pop()) || '';

        //console.log(`Comparando:
        //  Título: ${title}, 
        //  Dirección: ${address}, 
        //  Distrito: ${districtName}`
        //);

        // Verificar coincidencias parciales en los campos
        return (
          title.includes(normalizeText(query)) || 
          address.includes(normalizeText(query)) || 
          districtName.includes(normalizeText(query))
        );
      });

      console.log('Resultados filtrados:', filtered); // Depuración de resultados

      // Actualizar resultados
      setFilteredResults(filtered);
      onResults(filtered); // Pasar resultados al componente padre

      // Actualizar marcadores en el mapa
      const markers = filtered
        .filter((parking) => parking.location && parking.location.latitude && parking.location.longitude) // Filtrar datos válidos
        .map((parking) => parking);
      
    } else {
      console.log('Consulta vacía. Limpiando resultados.');
      setFilteredResults([]); // Limpiar resultados
      onResults([]); // Limpiar resultados en el padre
      
    }
  }, [query, parkings, onResults, lastQuery]); // Dependencias

  // Renderizado del componente
  return (
    <div>
      <h2>Listado de aparcamientos</h2>
      {/* Mostrar errores si ocurren */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Mostrar resultados */}
      {filteredResults.length === 0 ? (
        <p>No se encontraron resultados.</p>
      ) : (
        <ul className="list-group">
          {filteredResults.map((parking) => (
            <li key={parking['@id']} className="list-group-item">
              <strong>{parking.title}</strong>
              <p>Dirección: {parking.address['street-address']}</p>
              <p>Distrito: {parking.address.district['@id'].split('/').pop()}</p>
              <p>Horario: {parking.organization.schedule || 'No disponible'}</p>
              <GoogleMapsLink address={parking.address['street-address']} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchParking;
