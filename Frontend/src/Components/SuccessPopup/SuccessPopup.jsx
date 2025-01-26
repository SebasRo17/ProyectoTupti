import React from 'react';
import './SuccessPopup.css';

const SuccessPopup = ({ message, onClose }) => {
    return (
        <div className="success-popup-overlay">
            <div className="success-popup">
                <div className="success-icon">✓</div>
                <p>{message}</p>
                <button onClick={onClose}>Aceptar</button>
            </div>
        </div>
    );
};

export default SuccessPopup;
