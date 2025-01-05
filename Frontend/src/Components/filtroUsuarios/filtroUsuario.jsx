import React, { useState } from 'react';
import './filtroUsuario.css';

const FiltroUsuario = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [estado, setEstado] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    console.log('Filtering with:', { searchTerm, estado, fechaRegistro });
  };

  return (
    <header className="usuarios-header">
      <div className="search-container">
        <div className="search-input-container">
          <input 
            type="text" 
            placeholder="Buscar usuarios..." 
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="search-button">
            🔍 Buscar
          </button>
        </div>
        
        <select 
          className="estado-dropdown"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="">Estado</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <input 
          type="date"
          className="fecha-registro"
          value={fechaRegistro}
          onChange={(e) => setFechaRegistro(e.target.value)}
          placeholder="Fecha de registro"
        />

        <button 
          className="filter-button"
          onClick={handleFilter}
        >
          Filtrar
        </button>
      </div>
    </header>
  );
};

export default FiltroUsuario;