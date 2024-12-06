// src/components/Header/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">
        <img 
          src="https://res.cloudinary.com/dd7etqrf2/image/upload/v1732717569/tupti_3_r82cww.svg"
          alt="TUPTI"
          className="logo-imagen"
        />
      </div>
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Buscar productos..." 
          className="search-input"
        />
        <button className="search-icon" aria-label="Buscar">🔍</button>
      </div>
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
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <span>🛒</span>
            Carrito
          </button>
        </nav>
      </div>

      <div className="header-icons">
        <button>📍 Dirección </button>
        <Link to="/Login">
          <button>👤 Inicia Sesión</button>
        </Link>
        <button>🛒 Carrito</button>
      </div>
    </header>
  );
};

export default Header;
