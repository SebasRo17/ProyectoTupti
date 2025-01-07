import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Cargando productos...</p>
      <img 
        src="https://res.cloudinary.com/dd7etqrf2/image/upload/v1734134733/tupti_4_i0nwzz.png" 
        alt="TUPTI" 
        className="loading-logo"
      />
    </div>
  );
};

export default LoadingSpinner;