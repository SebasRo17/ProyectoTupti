import React,  { useState } from "react";
import './headerAdmin.css';

const HeaderAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
      // Sample data - replace with your actual data source
  const products = [
    { id: 1, name: "Yogur Natural", price: "$2.49", image: "/images/yogur-natural.png" },
    { id: 2, name: "Leche Descremada", price: "$1.20", image: "/images/leche-descremada.png" },
    // ...existing products
  ];
  
    const handleSearch = (e) => {
      const value = e.target.value;
      setSearchTerm(value);
  
      if (value.length > 0) {
        const filteredProducts = productos.filter(product =>
          product.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredProducts);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
  
    const handleSuggestionClick = (suggestion) => {
      setSearchTerm(suggestion);
      setShowSuggestions(false);
    };
  
  return (
    <header className="headerAdmin">
      <div className="header-search">
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
        </div>
        <button className="search-button">🔍</button>
      </div>
      <div className="header-actions">
        <button className="action-button">🔔</button>
        <button className="action-button">💬</button>
        <div className="profile-icon"></div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
