import React, { useState } from 'react';

function SearchBar({ onSearch, onToggle24Hours }) {
  const [query, setQuery] = useState('');
  const [filter24Hours, setFilter24Hours] = useState(false);


  //actualiza el estado cuando cambia el texto
  const handleInputChange = (event) => { 
    setQuery(event.target.value); // Actualiza el estado local
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query); // Llama al prop con el término de búsqueda
    } else {
      alert('Por favor, introduce un término para buscar.');
    }
  };

  // Detecta la tecla Enter
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
        <input
          type="checkbox"
          className="form-check-input"
          id="filter24Hours"
          checked={filter24Hours}
          onChange={handleToggle}
          style={{ marginRight: '5px' }}
        />
        <label className="form-check-label" htmlFor="filter24Hours">
          Sólo 24 horas
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
        onKeyDown={handleKeyDown} // Detecta la tecla Enter
      />
      
      
    </div>
  );
}

export default SearchBar;
