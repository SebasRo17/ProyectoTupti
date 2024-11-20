import React, { useState } from 'react';
import './pantallaPrincipal.css';

const TuptiPage = ({ images }) => {
  const imageData = images || Array.from({ length: 20 }, (_, i) => ({
    id: i,
    title: `Product ${i + 1}`,
    price: `$${(Math.random() * 100).toFixed(2)}`,
  }));

  const [activeSlide, setActiveSlide] = useState(0);

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % imageData.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + imageData.length) % imageData.length);
  };

  return (
    <div className="tupti-container">
      {/* Cabecera */}
      <header className="header">
        <div className="logo">TUPTI</div>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
          <button>+</button>
        </div>
        <div className="header-icons">
          <button>☰</button>
          <button>📍</button>
          <button>👤</button>
          <button>🛒</button>
        </div>
      </header>

      {/* Barra de Categorías */}
      <div className="categories-bar">
        {Array.from({ length: 15 }).map((_, index) => (
          <div key={index} className="category-item">
            <div className="icon">🔵</div>
            <div>Label</div>
          </div>
        ))}
      </div>
      <div>
      <img
        src="ruta_de_tu_imagen.jpg" /* Reemplaza con la URL de tu imagen */
        alt="LOGO TIPTI"
        className="fixed-image"
      />
      </div>
      {/* Menú Vertical */}
      <div className="image-menu">
        <h3>Menu Section</h3>
        <div className="menu-links">
          <a href="#">Menu Item 1</a>
          <a href="#">Menu Item 2</a>
          <a href="#">Menu Item 3</a>
        </div>
      </div>

      {/* Contenedor para el slider dinámico */}
      <div className="slider-container">
        <div className="image-slider">
          <div
            className="slider-images"
            style={{
              transform: `translateX(-${activeSlide * 100}%)`,
            }}
          >
            {imageData.map((image, index) => (
              <img
                key={image.id}
                src={image.imageUrl}
                alt={image.title}
                className={`slider-image ${index === activeSlide ? 'active' : ''}`}
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

      {/* Contenido Principal */}
      <div className="main-content">
        {imageData.reduce((sections, image, index) => {
          const sectionIndex = Math.floor(index / 10);
          if (!sections[sectionIndex]) sections[sectionIndex] = [];
          sections[sectionIndex].push(image);
          return sections;
        }, []).map((section, sectionIndex) => (
          <div className="image-section" key={sectionIndex}>
            <h3>Section Title {sectionIndex + 1}</h3>
            <div className="image-carousel">
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
          </div>
        ))}
      </div>

      {/* Pie de Página */}
      <footer className="footer">
        <div>
          <h4>Footer Section</h4>
          <p>Information about Tupti</p>
        </div>
      </footer>
    </div>
  );
};

export default TuptiPage;
