import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryNames, categoryIcons } from '../../data/categoryData.js';
import './pantallaPrincipal.css';
import Login from '../Login/Login.jsx';
import Categoria from '../Categoria/Categoria.jsx';

const CategoriesBar = ({ categoryData }) => {
  const scrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Categories passed to CategoriesBar:', categoryData);
  }, [categoryData]);

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
          <Link to={'/Categoria'} key={category.id || index} className="category-item">
          <div key={category.id || index} className="category-item">
            <img 
              src={category.icon} 
              alt={category.label || `Category ${index + 1}`} 
              className="category-icon" 
            />
            <div>{category.label || `Category ${index + 1}`}</div>
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

// Main TuptiPage Component
const TuptiPage = ({ carouselImages, categoryImages }) => {
  const defaultCarouselImages = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    imageUrl: `https://via.placeholder.com/300?text=Carrusel+${i + 1}`,
    title: `Producto Carrusel ${i + 1}`,
    price: `$${(Math.random() * 100).toFixed(2)}`,
  }));

// PantallaPrincipal.jsx
const defaultCategoryImages = categoryNames.map((name, i) => ({
  id: i,
  icon: categoryIcons[name],
  label: name,
}));

  const carouselData = carouselImages || defaultCarouselImages;
  const categoryData = categoryImages || defaultCategoryImages;

  const [activeSlide, setActiveSlide] = useState(0);

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % carouselData.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

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
          <input type="text" placeholder="Search..." />
          <button>+</button>
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
          <button className="carousel-button left" onClick={handlePrevSlide}>
            ❮
          </button>
          <button className="carousel-button right" onClick={handleNextSlide}>
            ❯
          </button>
        </div>
      </div>

      {/* Secciones del Carrusel */}
      <div className="main-content">
        {carouselData
          .reduce((sections, image, index) => {
            const sectionIndex = Math.floor(index / 15);
            if (!sections[sectionIndex]) sections[sectionIndex] = [];
            sections[sectionIndex].push(image);
            return sections;
          }, [])
          .map((section, sectionIndex) => (
            <div key={sectionIndex} className="image-section">
              <h3>Sección {sectionIndex + 1}</h3>
              <div
                ref={(el) => (sectionRefs.current[sectionIndex] = el)}
                className="image-carousel"
              >
                {section.map((image) => (
                  <div key={image.id} className="product-item">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="image-placeholder"
                    />
                    <p>{image.title}</p>
                    <p>{image.price}</p>
                  </div>
                ))}
              </div>
              <button
                className="section-button left"
                onClick={() => scrollSectionLeft(sectionIndex)}
              >
                ❮
              </button>
              <button
                className="section-button right"
                onClick={() => scrollSectionRight(sectionIndex)}
              >
                ❯
              </button>
            </div>
          ))}
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