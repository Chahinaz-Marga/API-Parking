import React, { useState, useEffect, useRef } from 'react';

function SearchPlaces({ query, onResult }) {
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);
  const hasSearched = useRef(false); // Usamos una ref para evitar bucles

  console.log('Búsqueda en Google Places activada con query:', query);

  // Inicializar Google Places API
  useEffect(() => {
    const loadService = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        console.log('Google Places API cargada correctamente.');
        const map = new window.google.maps.Map(document.createElement('div'));
        setService(new window.google.maps.places.PlacesService(map));
      } else {
        setError('Google Places API no está disponible.');
        console.error('No se pudo cargar Google Places API.');
      }
    };
    loadService();
  }, []); // Solo se ejecuta una vez al cargar el componente

  // Efecto para realizar la búsqueda
  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    // Verifica si ya se ha buscado o si el query está vacío
    if (!service || !normalizedQuery || hasSearched.current) {
      console.log('Búsqueda bloqueada. Ya se ha realizado o el query está vacío.');
      return;
    }

    console.log('Búsqueda válida enviada:', query); // Depuración

    const request = {
      query,
      fields: ['name', 'geometry'],
    };

    service.findPlaceFromQuery(request, (places, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && places.length > 0) {
        const place = places[0];
        const result = {
          name: place.name,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        console.log('Resultado enviado:', result); // Depuración
        onResult(result);
        console.log (result);

        // Marcar búsqueda como realizada
        hasSearched.current = true; // Cambiamos el estado solo aquí
      } else {
        console.error('No se encontraron lugares en Google Places.');
        onResult(null);
        setError('No se encontraron lugares.');
      }
    });
  }, [normalizedQuery, service]); // Ahora solo depende del query inicial y el servicio (NO de estados reactivos)

  console.log('Query normalizado:', normalizedQuery);

  return (
    <div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default SearchPlaces;
