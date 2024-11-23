import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Login.css";
import Registro from '../Registro/Registro.jsx';
import { FcGoogle } from "react-icons/fc"; // Ícono de Google
import { FaFacebookF } from "react-icons/fa"; // Ícono de Facebook
 
function Login() {
  return (
    <div className="App">
      <div className="modal-overlay">
        <div className="modal">
          {/* Sección izquierda */}
          <div className="modal-left">
            <h1>TUPTI</h1>
            <h2>1</h2>
            <p>“Todo lo que necesitas directo a tu puerta”</p>
          </div>
 
          {/* Sección derecha */}
          <div className="modal-right">
            <h2>Bienvenidos</h2>
            <form>
              <input type="email" placeholder="Correo electrónico" required />
              {/*<div>{errors.email && <p>este campo es requerido</p> }</div>*/}
              <input type="password" placeholder="Contraseña" required />
              <button type="submit">Login</button>
            </form>
           
            {/* Opciones adicionales */}
            <div className="login-options">
              <label>
                <input type="checkbox" /> Mantener iniciada la sesión
              </label>
              <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>
           
            <p>
              ¿No tienes cuenta?<Link to="/Registro/Registro.jsx"> <a href="#">Registrarte</a></Link>
            </p>
 
            {/* Botones sociales */}
            <div className="social-buttons">
              {/* Botón de Google */}
              <button className="social-button google">
                <FcGoogle className="social-icon" /> {/* Ícono de Google */}
              </button>
 
              {/* Botón de Facebook con solo el ícono */}
              <button className="social-button facebook">
                <FaFacebookF className="social-icon" /> {/* Ícono de Facebook */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default Login;