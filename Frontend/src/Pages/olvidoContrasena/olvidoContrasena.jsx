import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./olvidoContrasena.css";

function OlvidoContrasena() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el correo de recuperación
    console.log('Solicitud de recuperación para:', email);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Recuperar Contraseña</h1>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <div className="input-container">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input 
                type="email" 
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="login-button">
            Enviar Instrucciones
          </button>
        </form>

        <div className="signup-link">
          <Link to="/login" className="signup-text">Volver al Login</Link>
        </div>
      </div>
    </div>
  );
}

export default OlvidoContrasena;