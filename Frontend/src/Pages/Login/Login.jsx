import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc"; // Ícono de Google
import { FaFacebookF } from "react-icons/fa"; // Ícono de Facebook
import { HiEye, HiEyeOff } from "react-icons/hi"; // Iconos de ojo
import "./Login.css";

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [passwordError, setPasswordError] = useState(""); // Estado para el mensaje de error


  const handleCheckboxChange = (e) => {
    setStayLoggedIn(e.target.checked);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError("Por favor, ingresa un correo electrónico válido.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  
    if (value.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
    } else {
      setPasswordError("");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>LOGIN</h1>

        <form className="login-form">
          <div className="form-group">
            <label>Usuario</label>
            <div className="input-container">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <input
                onChange={handleEmailChange}
                type="text"
                placeholder="Correo electrónico"
                value={email}
              />
            </div>
            {/* Mensaje de error en rojo justo debajo del input */}
            {emailError && <p className="login-error-message">{emailError}</p>}
          </div>

       <div className="form-group">
         <label htmlFor="password">Contraseña</label>
          <div className="input-container">
           <span className="input-icon">
             <svg
               xmlns="http://www.w3.org/2000/svg"
               className="icon"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
              >
               <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
               <path d="M7 11V7a5 5 0 0110 0v4"></path>
            </svg>
          </span>
          <input
          id="password"
          type={passwordVisible ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={handlePasswordChange}
        />
        <span className="password-toggle" onClick={togglePasswordVisibility}>
          {passwordVisible ? <HiEyeOff /> : <HiEye />}
        </span>
      </div>
      {passwordError && <p className="login-error-message">{passwordError}</p>}
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

          <div className="forgot-password">
            <Link to="/olvido-contrasena">¿Olvidaste tu contraseña?</Link>
          </div>

          <button 
          type="submit" 
          className="login-button"
          disabled={emailError !== "" || passwordError !== ""}
          >
            
            LOGIN
          </button>
        </form>

        <div className="social-login">
          <p>Regístrate con</p>
          <div className="social-buttons">
            <button className="login-facebook">
              <FaFacebookF />
            </button>
            <button className="login-google">
              <FcGoogle />
            </button>
          </div>
        </div>

        <div className="signup-link">
          <p>¿No tienes una cuenta?</p>
          <Link to="../Registro/Registro.jsx" className="signup-text">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
