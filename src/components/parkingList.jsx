import React, { useEffect, useState } from 'react';
import { useLoadScript } from "@react-google-maps/api";
import SearchBar from './searchBar';
import MapWithPlaceholder from './mapPlaceholder';
import GoogleMapsLink from './googleMapsLink';

// Prueba de carga de ParkingList.json
fetch('/data/parkingList.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error HTTP! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => console.log('Archivo JSON cargado:', data))
  .catch(error => console.error('Error cargando JSON:', error));



// Configurar la librería necesaria para Google Places
const libraries = ["places"];

// Función para calcular la distancia entre dos coordenadas (Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distancia en km
}

function ParkingList() {
  // Estados
  const [parkings, setParkings] = useState([]);
  const [filteredParkings, setFilteredParkings] = useState([]);
  const [googleResult, setGoogleResult] = useState(null);
  const [error, setError] = useState(null);

  // Cargar la API de Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_API_GOOGLE_KEY, // Usa la clave del .env
    libraries: libraries,
  });

  // Cargar datos del archivo JSON local
  useEffect(() => {
    const loadParkings = async () => {
      try {
        console.log('Iniciando carga del archivo JSON...');
        const response = await fetch('http://localhost:5174/data/parkingList.json'); // Ruta relativa al directorio 'public'
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
    
        // Depuración: imprimir el contenido cargado en consola
        console.log('Contenido del archivo JSON cargado:', data);
    
        // Verificar si tiene la clave @graph
        if (!data["@graph"]) {
          throw new Error('El archivo JSON no contiene la clave @graph esperada.');
        }
    
        setParkings(data["@graph"]); // Accede a los datos en la clave "@graph"
        setFilteredParkings(data["@graph"]);
        console.log('Datos cargados correctamente.');
      } catch (err) {
        setError('Error cargando el archivo parkingList.json');
        console.error('Error cargando parkings:', err);
      }
    };
    
    loadParkings();
  }, []);

  // Función para buscar en el archivo JSON y en Google Places
  const handleSearch = async (searchTerm) => {
    const lowercasedTerm = searchTerm.toLowerCase();

    // Filtrado en el archivo JSON local
    const filtered = parkings.filter((parking) => {
      const titleMatch = parking.title?.toLowerCase().includes(lowercasedTerm) || false;
      const addressMatch = parking.address?.['street-address']?.toLowerCase().includes(lowercasedTerm) || false;
      const districtMatch = parking.address?.district?.['@id']?.split('/').pop().toLowerCase().includes(lowercasedTerm) || false;
      return titleMatch || addressMatch || districtMatch;
    });

    setFilteredParkings(filtered);

    // Si no encuentra resultados en el JSON, buscar en Google Places
    if (filtered.length === 0 && isLoaded) {
      console.log("Buscando en Google Places...");
      
      const performGoogleSearch = (searchTerm) => {
        return new Promise((resolve, reject) => {
          const googleMapDiv = document.getElementById('google-maps-div') || document.createElement('div');
          googleMapDiv.setAttribute('id', 'google-maps-div');
          document.body.appendChild(googleMapDiv);

          const service = new window.google.maps.places.PlacesService(googleMapDiv);
          service.textSearch({ query: searchTerm }, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
              resolve(results[0]);
            } else {
              reject(`Error en Google Places: ${status}`);
            }
          });
        });
      };

      try {
        const place = await performGoogleSearch(searchTerm);
        const googlePlace = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          name: place.name,
        };
        setGoogleResult(googlePlace);

        const nearbyParkings = parkings.filter((parking) => {
          const distance = calculateDistance(
            googlePlace.lat,
            googlePlace.lng,
            parking.location.latitude,
            parking.location.longitude
          );
          return distance <= 0.5;
        });

        setFilteredParkings(nearbyParkings);
      } catch (error) {
        console.error(error);
        setGoogleResult(null);
      }
    }
  };

  // Filtrar aparcamientos abiertos 24 horas
  const filter24Hours = () => {
    const filtered = parkings.filter((parking) =>
      parking.organization?.schedule?.toLowerCase().includes('24 horas')
    );
    setFilteredParkings(filtered);
  };

  // Mostrar errores si existen
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Renderizar el componente
  return (
    <div className="d-flex gap-1 container mt-4">
      <div>
        <h2>Listado de Aparcamientos</h2>
        <SearchBar onSearch={handleSearch} />
        <button className="btn btn-primary mb-2" onClick={filter24Hours}>
          Mostrar 24 Horas
        </button>
        {filteredParkings.length === 0 && !googleResult ? (
          <p>No se encontraron resultados.</p>
        ) : (
          <ul className="list-group">
            {filteredParkings.map((parking) => (
              <li key={parking.id} className="list-group-item">
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
      <MapWithPlaceholder 
        parkings={filteredParkings} 
        googleResult={googleResult} 
      />
    </div>
  );
}

export default ParkingList;
