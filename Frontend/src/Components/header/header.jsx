import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css'; // Crea un archivo CSS para los estilos específicos del header
import TuptiPage from '../../Pages/pantallaPrincipal/pantallaPrincipal';'../../Pages/pantallaPrincipal/pantallaPrincipal.jsx'
import CarritoCompras from '../CarritoCompras/CarritoCompras';

const Header = ({ toggleCart }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">
      <Link to="/">
      <button>
        <img 
          src="https://res.cloudinary.com/dd7etqrf2/image/upload/v1732717569/tupti_3_r82cww.svg" 
          alt="TUPTI" 
          className="logo-imagen" 
        />
      </button>
    </Link>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Buscar productos..." 
          className="search-input"
        />
        <button className="search-icon" aria-label="Buscar">🔍</button>
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
  );
};

export default Header;
