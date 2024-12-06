import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryNames, categoryIcons, categoryIds } from '../../data/categoryData.js';
import { promoImg } from '../../data/promoData.js';
import './pantallaPrincipal.css';
import './responsivePPrincipal.css'
import Login from '../Login/Login.jsx';
import Categoria from '../Categoria/Categoria.jsx';
import { getBestSellers } from '../../Api/bestSellApi';

const CategoriesBar = ({ categoryData }) => {
  const scrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);


  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Ensure categoryData is always an array
  const safeCategoryData = Array.isArray(categoryData) ? categoryData : [];

  return (
    <div className="categories-container">
      {showLeftButton && (
        <button 
          className="category-nav-button left" 
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          ❮
        </button>
      )}
      
      <div className="categories-bar" ref={scrollRef}>
        {safeCategoryData.map((category, index) => (
          <Link to={`/Categoria/${category.id}`} key={category.id} className="category-item">
            <div className="category-item">
              <img 
                src={category.icon} 
                alt={category.label} 
                className="category-icon" 
              />
              <div>{category.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {showRightButton && (
        <button 
          className="category-nav-button right" 
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          ❯
        </button>
      )}
    </div>
  );
};

const TuptiPage = ({ carouselImages, categoryImages }) => {
  const [productCarouselImages, setProductCarouselImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    id: i,
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
        <div className="product-list" ref={(el) => (sectionRefs.current[0] = el)}>
          {productCarouselImages.map((product) => (
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
        <button className="section-button left" onClick={() => scrollSectionLeft(0)}>❮</button>
        <button className="section-button right" onClick={() => scrollSectionRight(0)}>❯</button>
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

      {/* Categories Bar - Using the new component */}
      <CategoriesBar categoryData={categoryData} />
      
      <div>
        <img
          src="https://res.cloudinary.com/dd7etqrf2/image/upload/v1732711339/tupti_1_wt0zve.svg"
          alt="LOGO TUPTI"
          className="fixed-image"
        />
      </div>

      {/* Vertical Menu */}
      <div className="image-menu">
        <h3>Menú</h3>
        <div className="menu-links">
          <a href="#">Cupones</a>
          <a href="#">Promociones</a>
        </div>
        <h3>Categorias</h3>
        <div className="menu-links">
          <a href="#">Ofertas</a>
          <a href="#">Lacteos</a>
          <a href="#">Dulces</a>
          <a href="#">Carbohidratos</a>
          <a href="#">Gluten Free</a>
        </div>
      </div>

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
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column" id="contacto">
            <h4>TUPTI</h4>
            <p>Quito - Ecuador</p>
            <p>(+593) 998 616 470</p>
            <p>support@tupti.com</p>
          </div>

          <div className="footer-column" id="categoria">
            <h4>Top Categorías</h4>
            <ul>
              <li>Electrónicos</li>
              <li>Accesorios</li>
              <li>Hogar</li>
              <li>Ropa</li>
            </ul>
          </div>

          <div className="footer-column" id="enlace">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#">Política de Privacidad</a></li>
              <li><a href="#">Términos de Uso</a></li>
              <li><a href="#">Ayuda</a></li>
              <li><a href="#contactanos">Contáctanos</a></li>
            </ul>
          </div>

          <div className="footer-column" id="botones">
            <h4>Encuéntranos</h4>
            <div className="app-buttons">
              <button>Google Play</button>
              <button>App Store</button>
            </div>
          </div>

          <div className="footer-column" id="etiqueta">
            <h4>Etiquetas Populares</h4>
            <div className="tag-container">
              <span className="tag">Tech</span>
              <span className="tag">Moda</span>
              <span className="tag">Gaming</span>
              <span className="tag">Ofertas</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TuptiPage;