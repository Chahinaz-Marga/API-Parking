import React, { useEffect, useState } from 'react';

function SearchPlaces({ query, onResult }) {
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadService = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        const map = new window.google.maps.Map(document.createElement('div'));
        setService(new window.google.maps.places.PlacesService(map));
      } else {
        setError('Google Places API no está disponible.');
        console.error('No se pudo cargar Google Places API.');
      }
    };
    loadService();
  }, []);

  useEffect(() => {
    if (!service || !query.trim()) return;

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
        onResult(result); // Enviar el resultado
      } else {
        console.warn('No se encontraron lugares para la búsqueda:', query);
        setError('No se encontraron lugares.');
        onResult(null);
      }
    });
  }, [query, service]);

  return error ? <p style={{ color: 'red' }}>{error}</p> : null;
}

export default SearchPlaces;
