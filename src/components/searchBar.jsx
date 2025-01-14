import { HeatmapLayer } from '@react-google-maps/api';
import React, { useState } from 'react';
import Toggle from 'react-toggle';

function SearchBar({ onSearch, onToggle24Hours }) {
  const [query, setQuery] = useState('');
  const [filter24Hours, setFilter24Hours] = useState(false);


  //actualiza el estado cuando cambia el texto
  const handleInputChange = (event) => { 
    setQuery(event.target.value); 
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    } else {
      alert('Por favor, introduce un término para buscar.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // Ejecuta la búsqueda al presionar Enter
    }
  };

  const handleToggle = () => {
    setFilter24Hours(!filter24Hours);
    onToggle24Hours(!filter24Hours);
  };

  return (
    <div className="search-container d-flex align-items-center">
      {/* Toggle de Bootstrap */}
      <div className="form-check form-switch position-relative" style={{ width: '100px', height: '40px' }}>
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="toggle24Hours"
          onChange={handleToggle}
          style={{
            width: '100px',
            height: '40px',
            padding: '0',
          }}
        />
        <label
          className="form-check-label position-absolute top-50 start-50 translate-middle fw-bold"
          htmlFor="toggle24Hours"
          style={{
            color: '#fff',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          24h
        </label>
      </div>

      <button onClick={handleSearch} className="btn btn-primary mx-2">
        Buscar
      </button>
      <input
        type="text"
        value={query}
        className="form-control me-3"
        placeholder="Buscar aparcamientos por nombre o distrito..."
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Enter
      />
      
      
    </div>
  );
}

export default SearchBar;
