import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryNames, categoryIcons } from '../../data/categoryData.js';
import './categoriesBar.css';
import { searchProducts } from '../../Api/searchProduts.js';
import { useNavigate } from 'react-router-dom';
const CategoriesBar = ({ categoryData }) => {
  const scrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const navigate = useNavigate();
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

  // Si no se proporciona categoryData, usar los datos predeterminados
  const defaultCategoryImages = categoryNames.map((name, i) => ({
    id: i + 1, // Asegurarse de que los IDs comiencen desde 1
    icon: categoryIcons[name],
    label: name,
  }));

  const safeCategoryData = Array.isArray(categoryData) ? categoryData : defaultCategoryImages;

  const handleCategoryClick = async (categoryId) => {
    try {
      const filteredProducts = await searchProducts({
        IdTipoProducto: categoryId // Changed from idTipoProducto to IdTipoProducto
      });
      
      console.log('Productos filtrados por categoría:', filteredProducts);
  
      if (filteredProducts.length > 0) {
        navigate(`/categoria/${categoryId}`, { 
          state: { 
            products: filteredProducts,
            categoryId: categoryId 
          } 
        });
      } else {
        console.log('No hay productos en esta categoría');
      }
    } catch (error) {
      console.error('Error al filtrar por categoría:', error);
    }
  };
  
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

      <div 
        className="categories-bar" 
        ref={scrollRef} 
        role="menu" 
        aria-label="Categorías de productos"
      >
        {safeCategoryData.map((category) => (
            <Link 
            to={`/Categoria/${category.id}`} 
            key={category.id} 
            className="category-item"
            onClick={() => handleCategoryClick(category.id)}
            role="menuitem"
            aria-label={`Ver productos de la categoría ${category.label}`}
          >
            <img 
              src={category.icon} 
              alt={`Ícono de ${category.label}`} 
              className="category-icon"
              role="img"
              aria-label={`Ícono representativo de la categoría ${category.label}`}
            />
            <div>{category.label}</div>
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
export default CategoriesBar;