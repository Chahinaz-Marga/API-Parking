import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

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

  return (
    <div className="mb-4">
      <input
        type="text"
        value={query}
        className="form-control"
        placeholder="Buscar aparcamientos por nombre o distrito..."
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Detecta la tecla Enter
      />
      <button onClick={handleSearch} className="btn btn-primary mt-2">
        Buscar
      </button>
    </div>
  );
}

export default SearchBar;
