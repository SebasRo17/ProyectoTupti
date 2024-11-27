import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import "./olvidoContrasena.css";
import Login from '../Login/Login.jsx';
import { HiEye, HiEyeOff } from "react-icons/hi"; // Iconos de ojo


function olvidoContrasena() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleCheckboxChange = (e) => {
    setStayLoggedIn(e.target.checked);
  };

  return (
    <div className="-container">
      <div className="login-card">
        <h1> LOGIN </h1>
        
        <form className="login-form">
          <div className="form-group">
            <label>Usuario</label>
            <div className="input-container">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Correo electronico"
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-container">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0110 0v4"></path>
                </svg>
              </span>
              <input 
                type={passwordVisible ? "text" : "password"} 
                placeholder="Contraseña"
                required 
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {passwordVisible ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={stayLoggedIn} 
                onChange={handleCheckboxChange} 
              />
              Mantener sesión iniciada
            </label>
          </div>



          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>

        <div className="social-login">
          <p>Registrate con</p>
          <div className="social-buttons">
            <button className="social-button facebook">
              <FaFacebookF />
            </button>
            <button className="social-button google">
              <FcGoogle />
            </button>
          </div>
        </div>

        <div className="signup-link">
          <p>¿No tienes una cuenta?</p>
          <Link to="../Registro/Registro.jsx" className="signup-text">Registrate</Link>
        </div>
      </div>
    </div>
  );
}

export default olvidoContrasena;