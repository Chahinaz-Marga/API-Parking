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
  const [is24HoursFilter, setIs24HoursFilter] = useState(false);
  const [searchRadius, setSearchRadius] = useState(1);

  console.log (searchStage);
  
  const handleRadiusChange = (event) => {
    const newRadius = Number(event.target.value); // Convertimos el valor del input a un número
    setSearchRadius(newRadius); // Actualizamos el estado del rango
    console.log(`Nuevo rango seleccionado: ${newRadius} km`);
  };

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

  const handleToggle24Hours = (isActive) => {
    setIs24HoursFilter(isActive);
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
    <div id="root">
      <Navbar />

      <div class="jumbotron custom-jumbotron text-center">
          <div class="container">
              <h1 class="display-4">¡Encuentra tu parking!</h1>
              <p class="lead">Aparca fácilmente cerca del teatro o donde quiera que vayas.</p>
          </div>
      </div>

      <div className = "contariner-fluid search-container">
        <SearchBar 
          onSearch={handleSearch} 
          onToggle24Hours={handleToggle24Hours}
        />
      </div>

      

      {searchStage === 'places' && googleResult && (
        <div style={{ margin: '5px 20px', position: 'relative' }}>
          <label htmlFor="radiusSlider">Selecciona el rango:</label>
          <div style={{ position: 'relative', width: '100%', marginTop: '20px' }}>
            <input
              id="radiusSlider"
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={searchRadius}
              onChange={handleRadiusChange}
              className="form-range"
              style={{ width: '100%' }}
            />
            <span
              style={{
                position: 'absolute',
                top: '-20px',
                left: `${((searchRadius - 0.5) / 9.5) * 100}%`,
                transform: 'translateX(-50%)',
                background: 'white',
                padding: '2px 5px',
                borderRadius: '4px',
                fontSize: '12px',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
              }}
            >
              {searchRadius} km
            </span>
          </div>
        </div>
      )}

      <div className = "main-content">
        <div className = "results">
          {searchStage === 'parking' && (
              <SearchParking 
                query={query} 
                onResults={handleParkingResults}
                is24HoursFilter={is24HoursFilter}
              />
          )}
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
              is24HoursFilter={is24HoursFilter}
              />
          )}          
        </div>
        <div className = "map-container">
        {searchStage === 'parking' && (
            <MapWithPlaceholder
              parkings={parkingResults}
              googleResult={googleResult}
              searchRadius={searchRadius}
              onMarkerClick={(parking) => alert(`Seleccionaste: ${parking.title}`)}
            />
          )}
          {searchStage === 'places' && (
            <MapWithPlaceholder
              parkings={searchStage === 'parking' ? parkingResults : filteredMarkers}
              googleResult={googleResult}
              searchStage={searchStage} // Nuevo prop
              searchRadius={searchRadius}
              onMarkerClick={(parking) => alert(`Seleccionaste: ${parking.title}`)}
            />
          )}
        </div>
      </div>
    </div>);
}

export default App;
