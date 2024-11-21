import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './pantallaPrincipal.css';
import Registro from '../Registro/Registro.jsx';

const TuptiPage = ({ carouselImages, categoryImages }) => {
  // Datos predeterminados para el carrusel
  const defaultCarouselImages = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    imageUrl: `https://via.placeholder.com/300?text=Carrusel+${i + 1}`,
    title: `Producto Carrusel ${i + 1}`,
    price: `$${(Math.random() * 100).toFixed(2)}`,
  }));

  // Datos predeterminados para las categorías
  const defaultCategoryImages = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    icon: `https://via.placeholder.com/50?text=Categoría+${i + 1}`,
    label: `Categoría ${i + 1}`,
  }));

  // Uso de props o valores predeterminados
  const carouselData = carouselImages || defaultCarouselImages;
  const categoryData = categoryImages || defaultCategoryImages;

  const [activeSlide, setActiveSlide] = useState(0);

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % carouselData.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  return (
    <div className="tupti-container" id="inicio">
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
          {/* Redirección al hacer clic en el ícono */}
          <Link to="../Registro/Registro.jsx">
            <button>👤</button> {/* Aquí usamos el componente Link para redirigir */}
          </Link>
          <button>🛒</button>
        </div>
      </header>

      {/* Barra de Categorías */}
      <div className="categories-bar">
        {categoryData.map((category) => (
          <div key={category.id} className="category-item">
            <img src={category.icon} alt={category.label} className="category-icon" />
            <div>{category.label}</div>
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

      {/* Carrusel */}
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
      
      {/* Contenido Principal */}
      <div className="main-content">
        {carouselData
          .reduce((sections, image, index) => {
            const sectionIndex = Math.floor(index / 5); // Cada sección tendrá 5 imágenes
            if (!sections[sectionIndex]) sections[sectionIndex] = [];
            sections[sectionIndex].push(image);
            return sections;
          }, [])
          .map((section, sectionIndex) => (
            <div className="image-section" key={sectionIndex}>
              <h3>Sección {sectionIndex + 1}</h3>
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
        <div className="footer-container">
          {/* Columna 1: Información de Contacto */}
          <div className="footer-column" id="contacto">
            <h4>TUPTI</h4>
            <p>Quito - Ecuador</p>
            <p>(+593) 998 616 470</p>
            <p>support@tupti.com</p>
          </div>

          {/* Columna 2: Categorías */}
          <div className="footer-column" id="categoria">
            <h4>Top Categorías</h4>
            <ul>
              <li>Electrónicos</li>
              <li>Accesorios</li>
              <li>Hogar</li>
              <li>Ropa</li>
            </ul>
          </div>

          {/* Columna 3: Enlaces Rápidos */}
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

          {/* Columna 4: Descarga de App */}
          <div className="footer-column" id="botones">
            <h4>Encuéntranos</h4>
            <div className="app-buttons">
              <button>Google Play</button>
              <button>App Store</button>
            </div>
          </div>

          {/* Columna 5: Etiquetas */}
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
