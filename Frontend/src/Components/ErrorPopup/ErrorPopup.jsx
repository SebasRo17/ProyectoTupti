import React from 'react';
import './ErrorPopup.css'; // Asegúrate de crear estilos para el pop-up

const ErrorPopup = ({ message, title = 'Error', onClose }) => {
  return (
    <div className="error-popup-overlay">
      <div className="error-popup">
        <div className="error-icon">✖</div>
        <h2>{title}</h2> {/* Título dinámico */}
        <p>{message}</p> {/* Mensaje dinámico */}
        <button onClick={onClose} className="error-popup-button">OK</button>
      </div>
    </div>
  );
};

export default ErrorPopup;

