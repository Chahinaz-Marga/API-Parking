import React, { useState } from 'react';
import Navbar from './components/navbar';
import SearchBar from './components/searchBar';
import SearchPlaces from './components/searchPlaces';
import MapWithPlaceholder from './components/mapPlaceholder';
import SearchParkingNear from './components/searchParkingNear';
import parkingData from '../public/data/parkingList.json'; // Carga del archivo JSON

function App() {
  const [query, setQuery] = useState('');
  const [parkings] = useState(parkingData['@graph']); // Aparcamientos del JSON
  const [userLocation, setUserLocation] = useState({ lat: 40.4168, lng: -3.7038 }); // Ubicación ejemplo
  const [radius, setRadius] = useState(5); // Radio de búsqueda inicial
  const [markers, setMarkers] = useState([]);

  const handleRadiusChange = (event) => {
    setRadius(event.target.value);
    console.log(`Nuevo radio de búsqueda: ${event.target.value} km`);
  };

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <button
          className="btn btn-primary mx-2"
          onClick={() => console.log('Buscar Parking')}
        >
          Buscar Parking
        </button>
        <button
          className="btn btn-outline-primary mx-2"
          onClick={() => console.log('Parking Cerca de')}
        >
          Parking Cerca de
        </button>
      </div>

      <div className="container">
        <h3>Parking Cerca de</h3>
        <div>
          <label htmlFor="radiusSlider">Selecciona el rango:</label>
          <input
            id="radiusSlider"
            type="range"
            min="1"
            max="8"
            value={radius}
            onChange={handleRadiusChange}
            className="form-range"
          />
          <span>{radius} km</span>
        </div>
        <SearchParkingNear
          parkings={parkings}
          userLocation={userLocation}
          radius={radius}
          onMarkersUpdate={(markers) => setMarkers(markers)}
        />
        <MapWithPlaceholder
          parkings={markers}
          onMarkerClick={(parking) => alert(`Seleccionaste: ${parking.title}`)}
        />
      </div>
    </div>
  );
}

export default App;
