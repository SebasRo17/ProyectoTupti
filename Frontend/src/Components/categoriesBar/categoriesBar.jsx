import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryNames, categoryIcons } from '../../data/categoryData.js';

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

  // Si no se proporciona categoryData, usar los datos predeterminados
  const defaultCategoryImages = categoryNames.map((name, i) => ({
    id: i,
    icon: categoryIcons[name],
    label: name,
  }));

  const safeCategoryData = Array.isArray(categoryData) ? categoryData : defaultCategoryImages;

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

export default CategoriesBar;