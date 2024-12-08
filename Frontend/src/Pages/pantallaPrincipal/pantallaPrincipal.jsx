import React, { useRef, useState, useEffect } from 'react';
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { Link } from 'react-router-dom';
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


const TuptiPage = ({ carouselImages, categoryImages }) => {
  const [productCarouselImages, setProductCarouselImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
                e.target.src = 'URL_DE_IMAGEN_POR_DEFECTO'; // Imagen por defecto
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
      <Header />

      {/* CategoriesBar */}
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