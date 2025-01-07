import React, { useState } from 'react';
import Navbar from './components/navbar';
import SearchBar from './components/searchBar';
import SearchPlaces from './components/searchPlaces';
import MapWithPlaceholder from './components/mapPlaceholder';
import { filterParkingsByDistance } from './components/filterParkings';
import parkingData from '../public/data/parkingList.json';

function App() {
  const [query, setQuery] = useState('');
  const [parkings] = useState(parkingData['@graph']); // Aparcamientos cargados del JSON
  const [googleResult, setGoogleResult] = useState(null); // Resultado de Google Places
  const [searchRadius, setSearchRadius] = useState(5); // Radio inicial en km
  const [filteredMarkers, setFilteredMarkers] = useState([]); // Marcadores filtrados para el mapa

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      console.log('Búsqueda en curso:', searchQuery);
      setQuery(searchQuery);
      setGoogleResult(null); // Limpiar resultado previo
      setFilteredMarkers([]); // Limpiar marcadores previos
    } else {
      console.warn('Consulta vacía.');
    }
  };

  const handleRadiusChange = (event) => {
    const newRadius = event.target.value;
    setSearchRadius(newRadius);
    console.log(`Nuevo radio: ${newRadius} km`);
    // Si ya tenemos un resultado de Google, actualizamos los parkings filtrados
    if (googleResult) {
      const nearbyParkings = filterParkingsByDistance(
        parkings,
        googleResult.lat,
        googleResult.lng,
        newRadius
      );
      setFilteredMarkers(nearbyParkings);
    }
  };

  const handleGoogleResult = (result) => {
    if (result) {
      console.log('Ubicación encontrada:', result);
      const nearbyParkings = filterParkingsByDistance(
        parkings,
        result.lat,
        result.lng,
        searchRadius
      );
      setFilteredMarkers(nearbyParkings); // Filtrar aparcamientos por distancia
      console.log('Parkings cercanos:', nearbyParkings);
    } else {
      console.warn('No se encontraron resultados en Google Places.');
    }
    setGoogleResult(result); // Actualizar la ubicación seleccionada
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h3>Parking Cerca de</h3>
        <SearchBar onSearch={handleSearch} />
        <div style={{ margin: '20px 0' }}>
          <label htmlFor="radiusSlider">Selecciona el rango:</label>
          <input
            id="radiusSlider"
            type="range"
            min="1"
            max="8"
            value={searchRadius}
            onChange={handleRadiusChange}
            className="form-range"
          />
          <span>{searchRadius} km</span>
        </div>
        <SearchPlaces query={query} onResult={handleGoogleResult} />
        <div style={{ marginTop: '20px', height: '500px' }}>
          <MapWithPlaceholder
            parkings={filteredMarkers}
            googleResult={googleResult}
            searchRadius={searchRadius}
            onMarkerClick={(parking) => alert(`Seleccionaste: ${parking.title}`)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
