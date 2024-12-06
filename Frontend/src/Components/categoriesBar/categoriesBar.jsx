import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './categoriesBar.css';


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

  const safeCategoryData = Array.isArray(categoryData) ? categoryData : [];

  return (
    <div className="categories-container">
      {showLeftButton && (
        <button className="category-nav-button left" onClick={scrollLeft}>❮</button>
      )}
      <div className="categories-bar" ref={scrollRef}>
        {safeCategoryData.map((category) => (
          <Link to={`/Categoria/${category.id}`} key={category.id} className="category-item">
            <img src={category.icon} alt={category.label} className="category-icon" />
            <div>{category.label}</div>
          </Link>
        ))}
      </div>
      {showRightButton && (
        <button className="category-nav-button right" onClick={scrollRight}>❯</button>
      )}
    </div>
  );
};

export default CategoriesBar;