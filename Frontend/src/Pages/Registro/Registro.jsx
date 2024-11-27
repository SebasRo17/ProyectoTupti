import React from "react";
import { Link } from 'react-router-dom'
import "./Registro.css";
import Login from '../Login/Login.jsx';
import { FcGoogle } from "react-icons/fc"; // Ícono de Google
import { FaFacebookF } from "react-icons/fa"; // Ícono de Facebook
import { HiEye, HiEyeOff } from "react-icons/hi"; // Iconos de ojo



  function Registro() {
    return (
      <div className="registro-container">
        <div className="container">
          <div className="form-container">
            {/* Título del formulario */}
            <div className="form-title">
              <h2>REGISTRARSE</h2>
            </div>
  
            {/* Campo de nombre completo */}
            <div className="form-group">
              <div className="field-title">Nombre completo</div>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  required
                />
              </div>
            </div>
  
            {/* Campo de correo electrónico */}
            <div className="form-group">
              <div className="field-title">Usuario</div>
              <div className="input-container">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  required
                />
              </div>
            </div>
  
            {/* Campo de contraseña */}
            <div className="form-group">
              <div className="field-title">Contraseña</div>
              <div className="input-container">
                <input
                  type="password"
                  placeholder="Contraseña"
                  required
                />
              </div>
            </div>
  
            {/* Campo de confirmación de contraseña */}
            <div className="form-group">
              <div className="field-title">Confirmar Contraseña</div>
              <div className="input-container">
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  required
                />
              </div>
            </div>
  
            {/* Botón de registro */}
            <div className="form-group">
              <button type="submit" className="btn">
                REGISTRARSE
              </button>
            </div>
  
            {/* Texto informativo sobre redes sociales */}
            <div className="social-text">Regístrate con</div>
  
            {/* Botones de redes sociales */}
            <div className="social-buttons">
              <div className="social-btn facebook">
                <FaFacebookF size={20} />
              </div>
              <div className="social-btn google">
                <FcGoogle size={20} />
              </div>
            </div>
  
            {/* Texto para redirigir al inicio de sesión */}
            <div className="bottom-text">
              ¿Ya tienes una cuenta?{" "}
              <a href="/login" className="login-link">Inicia sesión</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Registro;