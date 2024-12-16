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

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

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
        <AliceCarousel
          autoPlay
          autoPlayInterval={5000} // Aumentado a 5 segundos
          animationDuration={1500} // Duración de la animación más lenta
          infinite={false} // Desactivar el modo infinito
          disableDotsControls={false} // Mostrar los puntos de navegación
          disableButtonsControls={true}
          mouseTracking={true}
          items={productCarouselImages.map((product) => (
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
          responsive={{
            0: { 
              items: 2,
              itemsFit: 'contain' // Asegura que los items se ajusten correctamente
            },
            600: { 
              items: 3,
              itemsFit: 'contain'
            },
            1024: { 
              items: 5,
              itemsFit: 'contain'
            }
          }}
          paddingLeft={10} // Añadir padding
          paddingRight={10} // Añadir padding
        />
      </div>
    );
  };
  

  return (
    <div className="tupti-container" id="inicio">
      <Header 
        toggleCart={toggleCart} 
        isTokenActive={isTokenActive}
        handleLogout={handleLogout}
        isCartOpen={isCartOpen}
      />
      
      {/* Categories Bar */}
    <CategoriesBar />
  
 

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

      {/* Botones de promoción */}
      <div className="promo-buttons-container">
        <button className="promo-button button-1"></button>
        <button className="promo-button button-2"></button>
        <button className="promo-button button-3"></button>
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