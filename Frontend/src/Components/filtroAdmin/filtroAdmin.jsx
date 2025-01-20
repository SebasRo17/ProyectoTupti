import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NuevoDescuento from '../nuevoDescuento/nuevoDescuento';
import './filtroAdmin.css';

const FiltroAdmin = ({ showNewProduct = true , showNewDiscount = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const products = [
    { id: 1, name: 'Nintendo Switch', price: '$299.99', image: 'switch.jpg' },
    { id: 2, name: 'PlayStation 5', price: '$499.99', image: 'ps5.jpg' },
    { id: 3, name: 'Xbox Series X', price: '$499.99', image: 'xbox.jpg' }
  ];

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  const handleSuggestionClick = (product) => {
    setSearchTerm(product.name);
    setShowSuggestions(false);
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
              {suggestions.map((product) => (
                <li 
                  key={product.id} 
                  onClick={() => handleSuggestionClick(product)}
                  className="suggestion-item"
                >
                  <img src={product.image} alt={product.name} className="suggestion-image" />
                  <div className="suggestion-details">
                    <span>{product.name}</span>
                    <span className="suggestion-price">{product.price}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button className="search-button1">Buscar</button>
        </div>
        <select className="dropdown">
          <option>Stock</option>
          <option>Sin stock</option>
        </select>
        <select className="dropdown">
          <option>Categoría</option>
          <option>Consolas</option>
          <option>Electrónicos</option>
        </select>
        <button className="filter-button">Filtrar</button>
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