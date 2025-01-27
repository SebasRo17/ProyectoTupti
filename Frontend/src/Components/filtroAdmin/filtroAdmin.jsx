import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NuevoDescuento from '../nuevoDescuento/nuevoDescuento';
import './filtroAdmin.css';

const FiltroAdmin = ({ showNewProduct = true, showNewDiscount = true, onSearch, onFilterStateChange, onFilterNameChange, discounts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Enviar el término de búsqueda al componente padre
    onFilterNameChange(value);

    if (value.length > 0) {
      const filtered = discounts.filter(discount =>
        discount.producto.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (discount) => {
    setSearchTerm(discount.producto);
    setShowSuggestions(false);
    onFilterNameChange(discount.producto);
  };

  const handleStateChange = (e) => {
    onFilterStateChange(e.target.value);
  };

  return (
    <header className="productos-header">
      <div className="search-container">
        <div className="search-input-container">
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => setShowSuggestions(true)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((discount) => (
                <li 
                  key={discount.id} 
                  onClick={() => handleSuggestionClick(discount)}
                  className="suggestion-item"
                >
                  <div className="suggestion-details">
                    <span>{discount.producto}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <select className="dropdown" onChange={handleStateChange}>
          <option value="">Todos</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>
      <div className="action-buttons">
        {showNewDiscount && (
          <button onClick={handleOpenModal} className="discount-button">
            Nuevo Descuento
          </button>
        )}
        <NuevoDescuento 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
        />
        {showNewProduct && (
          <Link to="/NuevoProducto">
            <button className="new-product-button">Nuevo Producto</button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default FiltroAdmin;