import React from 'react';

function SearchBar({ onSearch }) {
  const handleInputChange = (event) => {
    onSearch(event.target.value); 
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        className="form-control"
        placeholder="Buscar aparcamientos por nombre o distrito..."
        onChange={handleInputChange}
      />
    </div>
  );
}

export default SearchBar;
