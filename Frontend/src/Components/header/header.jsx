import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import { productos } from '../../data/productos';
import TuptiPage from '../../Pages/pantallaPrincipal/pantallaPrincipal';

const Header = ({ toggleCart }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    <>
      <div className="debug-overlay" /> {/* Temporal para depuración */}
      <header className="header" style={{ position: 'fixed', zIndex: 1000 }}>
        {/* Logo */}
        <div className="logo">
        <Link to="/">
        <button className='btnLogo'>
          <img 
            src="https://res.cloudinary.com/dd7etqrf2/image/upload/v1734134733/tupti_4_i0nwzz.png" 
            alt="TUPTI" 
            className="logo-imagen" 
          />
        </button>
      </Link>
        </div>

        {/* Barra de búsqueda */}
        <div className="search-bar">
          <div className="search-container">
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
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
            <button className="search-icon" aria-label="Buscar">🔍</button>
          </div>
        </div>

        {/* Botón de menú móvil */}
        <button 
          className="hamburger-menu" 
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Menú"
        >
          ☰
        </button>

        {/* Menú móvil */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
          <button 
            className="mobile-nav-close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            ×
          </button>
          <nav className="mobile-nav-items">
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <span>📍</span>
              Dirección
            </button>
            <Link to="/Login" onClick={() => setIsMobileMenuOpen(false)}>
              <button>
                <span>👤</span>
                Inicia Sesión
              </button>
            </Link>
            <button onClick={() => { 
              toggleCart(); 
              setIsMobileMenuOpen(false); 
            }}>
              <span>🛒</span>
              Carrito
            </button>
          </nav>
        </div>

        {/* Iconos del header */}
        <div className="header-icons">
          <button className="icon-button">📍 Dirección</button>
          <Link to="/Login">
            <button className="btnLogin">Inicia Sesión</button>
          </Link>
          <Link to="/registro">
            <button className="btnRegister">Regístrate</button>
          </Link>
          <button className="header-cart-button" onClick={toggleCart}>
            🛒 Carrito
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
