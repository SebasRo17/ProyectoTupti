import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import { productos } from '../../data/productos';
import TuptiPage from '../../Pages/pantallaPrincipal/pantallaPrincipal';
import CarritoCompras from '../../Components/CarritoCompras/CarritoCompras.jsx';
import { searchProducts } from '../../Api/searchProduts.js';
import { getCarritoByUsuario } from '../../Api/carritoApi.js';
import jwtDecode from 'jwt-decode';

const Header = ({ toggleCart, isCartOpen}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(() => {
    // Verifica el token al cargar el componente
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const payload = jwtDecode(token);
        console.log('Token descifrado:', payload); // Agregar console.log para mostrar el token descifrado
        const currentTime = Date.now() / 1000;
        setIdUsuario(payload.user.IdUsuario); // Guardar idUsuario en el estado
        if (payload.exp <= currentTime) {
          localStorage.removeItem('jwtToken'); // Elimina token expirado
        }
      } catch (error) {
        console.error('Error decodificando el token:', error);
        localStorage.removeItem('jwtToken'); // Limpia token corrupto
      }
    }
  }, []);

  useEffect(() => {
    const fetchCarrito = async () => {
      if (idUsuario) {
        try {
          const carritoData = await getCarritoByUsuario(idUsuario);
          console.log('Carrito completo:', carritoData);
          console.log('Detalles del carrito:', carritoData.detalles);
          // Actualizar el estado de productos con los datos obtenidos
          setProductos(carritoData.detalles.map(detalle => ({
            id: detalle.IdProducto,
            nombre: detalle.Producto.Nombre,
            precio: parseFloat(detalle.PrecioUnitario),
            cantidad: detalle.Cantidad,
            imagen: detalle.Producto.ImagenUrl
          })));
        } catch (error) {
          console.error('Error al cargar el carrito:', error);
        }
      }
    };

    fetchCarrito();
  }, [idUsuario]);

// Lógica del carrito
const eliminarProducto = (productoId) => {
  setProductos(productos.filter((producto) => producto.id !== productoId));
};

const actualizarCantidad = (id, cantidad) => {
  setProductos(
    productos.map((producto) =>
      producto.id === id
        ? { ...producto, cantidad: Math.max(1, producto.cantidad + cantidad) }
        : producto
    )
  );
};

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    if (event.key === 'Enter') {
      try {
        const products = await searchProducts(searchTerm);
        console.log('Productos filtrados:', products);
        if (products.length > 0) {
          const idTipoProducto = products[0].IdTipoProducto;
          navigate(`/categoria/${idTipoProducto}`, { state: { products } }); // Redirige y pasa los productos como estado
        } else {
          console.log('No se encontraron productos.');
        }
      } catch (error) {
        console.error('Error al buscar productos:', error);
      }
    }
  };
  return (
    <>
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
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
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
      {/* Renderizar el carrito si está abierto */}
      {isCartOpen && (
        <div className="cart-overlay">
          <div className="cart-container">
            <button className="close-cart-button" onClick={toggleCart}>
              ✖ 
            </button>
            <CarritoCompras 
            productos={productos}
            eliminarProducto={eliminarProducto}
            actualizarCantidad={actualizarCantidad}
          />
          </div>
        </div>
        )}
    </>
  );
};

export default Header;
