import React, { useCallback, useState } from 'react';
import Navbar from './components/navbar';
import SearchBar from './components/searchBar';
import SearchParking from './components/searchParking';
import SearchPlaces from './components/searchPlaces';
import MapWithPlaceholder from './components/mapPlaceholder';
import parkingData from '../public/data/parkingList.json';
import FilterParkingsNear from './components/filterParkings';



const x = import.meta.env.VITE_API_GOOGLE_KEY;

window.initMap = () => {
  console.log('Google Maps API inicializada correctamente.');
};

function App() {
  const [query, setQuery] = useState('');
  const [parkingResults, setParkingResults] = useState([]);  //parkingResults son los datos válidos del json
  const [googleResult, setGoogleResult] = useState(null);   // googleResults es lo que devuelve Google Places 
  const [searchStage, setSearchStage] = useState('parking'); // busca en parkings o en Places
  const [filteredMarkers, setFilteredMarkers] = useState([]); // parkings a menos dist del Place
  const [parkings] = useState(parkingData['@graph']); // Todos los parkings del JSON
  const searchRadius = 2;

  console.log (searchStage);
  

 
  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) { 
      console.log('Actualizando término de búsqueda:', searchQuery); // inicia con los estados vacíos y buscando en parkings
      setQuery(searchQuery); 
      setSearchStage('parking'); 
      setParkingResults([]);
      setGoogleResult(null);
      setFilteredMarkers([]);
      } else {
      console.warn('Consulta vacía. No se realizará búsqueda.');
    }
  };

  

  // busca en el jason de parkins y si no hay resultado pasa al Places. 
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
  
  //busca en Places
  const handleGoogleResult = (result) => {
    console.log('Resultado de Google Places:', result); // Verificar el estado actualizado
  
    if (result && typeof result.lat === 'number' && typeof result.lng === 'number') {
      console.log('Ubicación encontrada:', result);
    } else {
      console.warn('No se encontraron resultados en Google Places o las coordenadas no son válidas.');
      setFilteredMarkers([]); // Limpia los resultados si no hay un resultado válido
    }
  
    setGoogleResult(result);
  };
   console.log(googleResult);

  //recupera los parkings cernanos al sitio de places
  const handleFilteredParkings = useCallback((filtered) => {
    console.log('Parkings filtrados recibidos desde FilterParkingsNear:', filtered);
    setFilteredMarkers(filtered); // Actualiza el estado de parkings en App
  }, []);

  console.log('Parkings filtrados recibidos:', filteredMarkers);

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
            />
          )}
          {searchStage === 'parking' && (
            <MapWithPlaceholder
              parkings={parkingResults}
              googleResult={googleResult}
              onMarkerClick={(parking) => alert(`Seleccionaste: ${parking.title}`)}
            />
          )}
        </div>
        <div>
          {searchStage === 'places' && (
              <SearchPlaces 
                query={query} 
                onResult={handleGoogleResult}
                />
          )}

          {searchStage === 'places' && googleResult && googleResult.lat && googleResult.lng && (
            <FilterParkingsNear
              center={ {lat : googleResult.lat, lng : googleResult.lng} }
              radius={searchRadius}
              onFilter={handleFilteredParkings}
              />
          )}
          
          {searchStage === 'places' && (
            <MapWithPlaceholder
              parkings={filteredMarkers}
              googleResult={googleResult}
              searchRadius={searchRadius}
              onMarkerClick={(parking) => alert(`Seleccionaste: ${parking.title}`)}
            />
          )}
        </div>
      </div>
    </div>);
}

export default App;
