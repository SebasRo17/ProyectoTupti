import React, { useState } from 'react';
import './filtroUsuario.css';

const FiltroUsuario = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [estado, setEstado] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEstadoChange = (e) => {
    const nuevoEstado = e.target.value;
    console.log('Nuevo estado seleccionado:', nuevoEstado);
    setEstado(nuevoEstado);
    onFilterChange({ estado: nuevoEstado });
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
          onChange={handleEstadoChange}
        >
          <option value="">Todos</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>
    </header>
  );
};

export default FiltroUsuario;