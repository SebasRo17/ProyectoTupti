import React, { useRef, useState, useEffect } from 'react';
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { Link, useNavigate } from 'react-router-dom';
import { categoryNames, categoryIcons, categoryIds } from '../../data/categoryData.js';
import { promoImg } from '../../data/promoData.js';
import './pantallaPrincipal.css';
import './responsivePPrincipal.css'
import Login from '../Login/Login.jsx';
import Categoria from '../Categoria/Categoria.jsx';
import { getBestSellers } from '../../Api/bestSellApi';
import CarritoCompras from '../../Components/CarritoCompras/CarritoCompras.jsx';
import Footer from '../../Components/footer/footer.jsx';
import CategoriesBar from '../../Components/categoriesBar/categoriesBar.jsx';
import Header from '../../Components/header/header.jsx';
import jwtDecode from 'jwt-decode';


const TuptiPage = ({ carouselImages, categoryImages }) => {
  const [productCarouselImages, setProductCarouselImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTokenActive, setIsTokenActive] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    // Verifica el token al cargar el componente
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const payload = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        setIsTokenActive(payload.exp > currentTime);
        if (payload.exp <= currentTime) {
          localStorage.removeItem('jwtToken'); // Elimina token expirado
        }
      } catch (error) {
        console.error('Error decodificando el token:', error);
        localStorage.removeItem('jwtToken'); // Limpia token corrupto
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsTokenActive(false);
    navigate('/');
  };

  const [productos, setProductos] = useState([
    { id: 1, nombre: "Manzana", precio: 10.5, cantidad: 1, imagen: "https://via.placeholder.com/150" },
    { id: 2, nombre: "Chocolate", precio: 20.0, cantidad: 2, imagen: "https://via.placeholder.com/150" },
    { id: 3, nombre: "Producto 3", precio: 5.5, cantidad: 5, imagen: "https://via.placeholder.com/150" },
    { id: 4, nombre: "Producto 4", precio: 2.0, cantidad: 2, imagen: "https://via.placeholder.com/150" },
    { id: 5, nombre: "Producto 5", precio: 6.0, cantidad: 2, imagen: "https://via.placeholder.com/150" },
    { id: 6, nombre: "Producto 6", precio: 1.0, cantidad: 3, imagen: "https://via.placeholder.com/150" },
  ]);



  // Función para eliminar un producto del carrito
  const eliminarProducto = (productoId) => {
    const productosActualizados = productos.filter(producto => producto.id !== productoId);
    setProductos(productosActualizados);
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
  
  

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  useEffect(() => {
    const fetchBestSellers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const bestSellers = await getBestSellers();
        if (!bestSellers || bestSellers.length === 0) {
          throw new Error('No se recibieron productos del servidor');
        }

        const formattedProducts = bestSellers.map((product, index) => ({
          id: product.IdProducto || index,
          imageUrl: product.Imagenes?.split(',')[0] || 'URL_IMAGEN_DEFAULT',
          title: product.Producto || 'Sin título',
          price: product.Precio ? `$${product.Precio}` : 'Precio no disponible',
          description: product.Descripcion || 'Sin descripción',
          allImages: product.Imagenes?.split(',') || []
        }));
        setProductCarouselImages(formattedProducts);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  // Mantener carouselData para las imágenes promocionales
  const carouselData = promoImg.map((imageUrl, index) => ({
    id: index,
    imageUrl: imageUrl,
    title: `Promoción ${index + 1}`
  }));  

  const defaultCategoryImages = categoryNames.map((name, i) => ({
    id: i + 1, // Modificado para empezar en 1 en lugar de 0
    icon: categoryIcons[name],
    label: name,
  }));

  const categoryData = categoryImages || defaultCategoryImages;

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000); // Cambia de imagen cada 5 segundos

    return () => clearInterval(timer);
  }, [carouselData.length]);

  // Referencias para cada sección del carrusel
  const sectionRefs = useRef([]);

  const scrollSectionLeft = (index) => {
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollSectionRight = (index) => {
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const renderProductSections = () => {
    if (isLoading) {
      return <div className="loading-message">Cargando productos...</div>;
    }

    if (error) {
      return <div className="error-message">Error: {error}</div>;
    }

    if (!productCarouselImages || productCarouselImages.length === 0) {
      return <div className="no-products-message">No hay productos disponibles</div>;
    }

    return productCarouselImages
      .reduce((sections, image, index) => {
        // Reducir el número de items por sección en móviles
        const itemsPerSection = window.innerWidth <= 767 ? 8 : 15;
        const sectionIndex = Math.floor(index / itemsPerSection);
        if (!sections[sectionIndex]) sections[sectionIndex] = [];
        sections[sectionIndex].push(image);
        return sections;
      }, [])
      .map((section, sectionIndex) => (
        <div key={sectionIndex} className="image-section">
          <h3>Sección {sectionIndex + 1}</h3>
          <div className="image-carousel" ref={(el) => (sectionRefs.current[sectionIndex] = el)}>
            {section.map((product) => (
              <div key={product.id} className="product-item">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="image-placeholder"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'URL_DE_IMAGEN_POR DEFECTO';
                  }}
                />
                <p className="product-title">{product.title}</p>
                <p className="product-price">{product.price}</p>
              </div>
            ))}
          </div>
          {/* Botones de navegación */}
          <button className="section-button left" onClick={() => scrollSectionLeft(sectionIndex)}>❮</button>
          <button className="section-button right" onClick={() => scrollSectionRight(sectionIndex)}>❯</button>
        </div>
      ));
  };

  const renderProductCarousel = () => {
    if (isLoading) return <div className="loading-message">Cargando productos...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    if (!productCarouselImages?.length) return <div>No hay productos disponibles</div>;
  
    return (
      <div className="product-carousel-container">
        {/* Carrusel Alice */}
        <AliceCarousel
        autoPlay
        autoPlayInterval={2000} // Intervalo para el auto-play (3 segundos)
        infinite={true}
        disableDotsControls={true} // Si quieres desactivar los puntos de navegación
        items={productCarouselImages.map((product) => (
          <div key={product.id} className="product-item">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="image-placeholder"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'URL_DE_IMAGEN_POR DEFECTO'; // Imagen por defecto
              }}
            />
            <p className="product-title">{product.title}</p>
            <p className="product-price">{product.price}</p>
          </div>
        ))}
        responsive={{
          0: { items: 2 },
          600: { items: 3 }, 
          1024: { items: 5 },
        }}
      />
      </div>
    );
  };
  

  return (
    <div className="tupti-container" id="inicio">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img 
            src="https://res.cloudinary.com/dd7etqrf2/image/upload/v1732717569/tupti_3_r82cww.svg " 
            alt="TUPTI" 
            className='logo-imagen'
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
        
                {/* Menú móvil actualizado */}
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
              
              {!isTokenActive ? (
                <Link to="/Login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button>
                    <span>👤</span>
                    Inicia Sesión
                  </button>
                </Link>
              ) : (
                <button onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}>
                  <span>👤</span>
                  Usuario
                </button>
              )}

              <button onClick={() => { 
                toggleCart(); 
                setIsMobileMenuOpen(false); 
              }}>
                <span>🛒</span>
                Carrito
              </button>
            </nav>
          </div>

        <div className="header-icons">
          {/* Botón de Dirección */}
          <button className="icon-button">📍 Dirección</button>
          {/* Mostrar botones de sesión o icono de usuario según el estado del token */}
          {!isTokenActive ? (
            <>
              <Link to="/Login">
                <button className="btnLogin">Inicia Sesión</button>
              </Link>
              <Link to="/registro">
                <button className="btnRegister">Regístrate</button>
              </Link>
            </>
          ) : (
            <div className="user-section">
              <span>👤</span>
              Usuario
              <button
                className="logout-button"
                onClick={handleLogout}
                aria-label="Cerrar sesión"
              >
                Salir
              </button>
            </div>
          )}
          {/* Botón del carrito */}
          <button className="header-cart-button" onClick={toggleCart}>
            🛒 Carrito
            <span className="icons-cart-counter">{productos.length}</span>
          </button>
        </div>
      </header>
      
   {/* Categories Bar */}
    <CategoriesBar />
    
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



      {/* Carousel */}
      <div className="slider-container">
        <div className="image-slider">
          <div
            className="slider-images"
            style={{
              transform: `translateX(-${activeSlide * 100}%)`,
            }}
          >
            {carouselData.map((image) => (
              <img
                key={image.id}
                src={image.imageUrl}
                alt={image.title}
                className={`slider-image ${image.id === activeSlide ? 'active' : ''}`}
              />
            ))}
          </div>
          <div className="progress-indicators">
            {carouselData.map((_, index) => (
              <div
                key={index}
                className={`progress-bar ${index === activeSlide ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Nuevo carrusel de productos */}
      <div className="main-content">
        <h2>Productos Destacados</h2>
        {renderProductCarousel()}
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TuptiPage;