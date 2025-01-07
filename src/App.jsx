import React, { useState } from 'react';
import Navbar from './components/navbar';
import SearchBar from './components/searchBar';
import SearchParking from './components/searchParking';
import SearchPlaces from './components/searchPlaces';
import MapWithPlaceholder from './components/mapPlaceholder';
import SearchParkingNear from './components/searchParkingNear';

const x = import.meta.env.VITE_API_GOOGLE_KEY;

window.initMap = () => {
  console.log('Google Maps API inicializada correctamente.');
};

function App() {
  const [query, setQuery] = useState('');
  const [parkingResults, setParkingResults] = useState([]);  //parkingResults son los datos válidos del json
  const [googleResult, setGoogleResult] = useState(null);   // googleResults es lo que devuelve Google Places 
  const [searchStage, setSearchStage] = useState('parking'); // Controla el flujo de búsqueda
  const [filteredResults, setFilteredResults] = useState([]); // Estado para resultados filtrados
  const [markers, setMarkers] = useState([]);

  console.log (searchStage);

 
    const handleSearch = (searchQuery) => {
      if (searchQuery.trim()) { 
        console.log('Actualizando término de búsqueda:', searchQuery); // Depuración
        setQuery(searchQuery); 
        setSearchStage('parking'); 
        setParkingResults([]);
        setGoogleResult(null);
        } else {
        console.warn('Consulta vacía. No se realizará búsqueda.');
      }
    };

    const handleResults = (results) => {
      setFilteredResults(results); // Actualiza el estado
      console.log('Resultados actualizados en App.jsx:', results); // Depuración
    };

    // handleParkingResults busca en el jason de parkins y si no hay resultado pasa al Places. 
    const handleParkingResults = (results) => {
      console.log('Resultados encontrados en parkingList.json:', results);

      if (results && results.length > 0) {
        //si hay resultados en el json
        setParkingResults(results); // Persistir resultados en el estado
        setSearchStage('parking'); // Mantener búsqueda local
        console.log('Resultados locales encontrados. Mostrando en mapa.');
      } else {
        //si NO hay resultados en json busca en Places
        console.log('Sin resultados locales. Cambiando a Google Places.');
        setSearchStage('places'); // Cambia a búsqueda en Google Places
      }
    };
    
    const handleMarkersUpdate = (markers) => {
      setParkingResults(markers); // Persistir los marcadores visibles
    };
        
    

  const handleGoogleResult = (result) => {
    console.log('Resultado de Google Places:', result); // Verificar el estado actualizado
    setGoogleResult(result);
  };

  return (
    <div>
      <Navbar />
      <SearchBar onSearch={handleSearch} />
      <div style={{ display: 'flex' }}>
        <div style={{ width: '30%', padding: '10px' }}>
          {searchStage === 'parking' && (
            <SearchParking 
              query={query} 
              onResults={handleParkingResults} 
              onMarkersUpdate={handleMarkersUpdate}
            />
          )}
          {searchStage === 'places' && (
            <SearchPlaces 
              query={query} 
              onResult={handleGoogleResult}
              />
          )}
        </div>

        <div>
          <SearchParkingNear
            googleResult={googleResult}
            parkings={filteredResults}
            onMarkersUpdate={(markers) => setMarkers(markers)}
           />
        </div>

        <div style={{ width: '70%', height: '500px' }}>
          <MapWithPlaceholder
            parkings={parkingResults}
            googleResult={googleResult}
            onMarkerClick={(parking) => alert(`Seleccionaste: ${parking.title}`)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
