import React, { useRef, useState, useEffect } from 'react';
import { addToCart } from '../../Api/carritoApi';
import axios from 'axios';
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
import ModalProducto from '../../Components/modalProducto/modalProducto.jsx';


const TuptiPage = ({ carouselImages, categoryImages }) => {
  const [productCarouselImages, setProductCarouselImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productos, setProductos] = useState([]); // Add productos state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTokenActive, setIsTokenActive] = useState(false);
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const bestSellers = await getBestSellers();
        const formattedProducts = bestSellers.map((product, index) => ({
          id: product.IdProducto,
          imageUrl: product.Imagenes?.split(',')[0] || '/images/placeholder.png',
          title: product.Producto,
          price: product.Precio ? `$${product.Precio}` : 'Precio no disponible',
          description: product.Descripcion,
          // Store all images as array
          imagenes: product.Imagenes?.split(',') || []
        }));
        console.log('Formatted products:', formattedProducts);
        setProductCarouselImages(formattedProducts);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBestSellers();
  }, []);
  
  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
    const formattedProduct = {
      IdProducto: product.id,
      Nombre: product.title,
      Precio: product.price,
      Descripcion: product.description,
      // Use first image as main image
      ImagenUrl: product.imageUrl,
      // Pass all images array
      Imagenes: product.imagenes || [product.imageUrl]
    };
    console.log('Formatted product:', formattedProduct);
    setSelectedProduct(formattedProduct);
  };
  
  const closeModal = () => {
    console.log('Cerrando modal'); // Log cierre
    setSelectedProduct(null);
  };

  
  const handleAgregarCarrito = async (product, cantidad) => {
    try {
      const productData = {
        idUsuario: localStorage.getItem('userId'), // Asume que tienes el ID del usuario guardado
        idProducto: product.IdProducto,
        cantidad: cantidad
      };

      const result = await addToCart(productData);
      console.log('Producto agregado al carrito:', result);
      
      // Opcional: Mostrar mensaje de éxito
      alert('Producto agregado al carrito exitosamente');
      
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar al carrito');
    }
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

    axios.get('https://proyectotupti.onrender.com/api-docs/')
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsTokenActive(false);
    navigate('/');
  };

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
  
  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const data = await getBestSellers();
            setProductos(data);
            setProductCarouselImages(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    fetchProducts();
}, []);

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
        <AliceCarousel
          autoPlay
          autoPlayInterval={5000} // Aumentado a 5 segundos
          animationDuration={1500} // Duración de la animación más lenta
          infinite={false} // Desactivar el modo infinito
          disableDotsControls={false} // Mostrar los puntos de navegación
          disableButtonsControls={true}
          mouseTracking={true}
          items={productCarouselImages.map((product) => (
          <div 
              key={product.id} 
              className="product-item"
              onClick={() => handleProductClick(product)}
              style={{ cursor: 'pointer' }}
          >
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
        {selectedProduct && (
          <ModalProducto
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAgregarCarrito}
          />
        )}
      </div>
    );
  };
  

  return (
    <div className="tupti-container" id="inicio">
      <Header 
        toggleCart={toggleCart} 
        isTokenActive={isTokenActive}
        handleLogout={handleLogout}
        productos={productos}
      />
      
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

      {/* Botones de promoción */}
      <div className="promo-buttons-container">
        <button className="promo-button button-1" 
        aria-label='Promocioón 1'
        role='button'
        tabIndex="0"
        ></button>
        <button className="promo-button button-2"
        aria-label='Promoción 2'
        role='button'
        tabIndex="0"
        ></button>
        <button className="promo-button button-3"
        aria-label='Promoción 3'
        role='button'
        tabIndex="0"
        ></button>
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