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
    <div className="search-container">
      <div className="d-flex align-items-center">
        <label className="d-flex align-items-center">
          <Toggle
            defaultChecked={filter24Hours}
            icons={false} // Sin imágenes en el toggle
            onChange={handleToggle}
          />
          <span style={{ marginLeft: '8px' }}>Sólo 24 horas</span>
        </label>
      </div>
       
      <button onClick={handleSearch} className="btn btn-primary mx-2">
        Buscar
      </button>
      <input
        type="text"
        value={query}
        className="form-control flex-grow-1"
        placeholder="Buscar aparcamientos por nombre o distrito..."
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Enter
      />
      
      
    </div>
  );
}

export default SearchBar;
