import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import "./Registro.css";
import Login from '../Login/Login.jsx';
import { FcGoogle } from "react-icons/fc"; // Ícono de Google
import { FaFacebookF } from "react-icons/fa"; // Ícono de Facebook
import { HiEye, HiEyeOff } from "react-icons/hi"; // Iconos de ojo


function Registro() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setPasswordError("Las contraseñas no coinciden.");
    } else {
      setPasswordError("");
    }
  };

  const handleRegister = () => {
    // Aquí puedes agregar la lógica para guardar los datos
    console.log("Usuario registrado:", { email, password, confirmPassword });
    // Limpia los campos después de registrar
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="registro-container">
      <div className="registro-container-inner">
        <div className="registro-form-container">
          <div className="registro-form-title">
            <h2>REGISTRARSE</h2>
          </div>

          <div className="registro-form-group">
            <div className="registro-field-title">Nombre completo</div>
            <div className="registro-input-container">
              <input
                type="text"
                placeholder="Nombre completo"
                required
                className="registro-input"
              />
            </div>
          </div>

          <div className="registro-form-group">
            <div className="registro-field-title">Usuario</div>
            <div className="registro-input-container">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Correo electrónico"
                required
                className="registro-input"
              />
              {emailError && <p className="registro-error-message">{emailError}</p>}
            </div>
          </div>

          <div className="registro-form-group">
            <div className="registro-field-title">Contraseña</div>
            <div className="registro-input-container">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Contraseña"
                required
                className="registro-input"
              />
              <span className="registro-password-toggle" onClick={togglePasswordVisibility}>
                {passwordVisible ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>
          </div>

          <div className="registro-form-group">
            <div className="registro-field-title">Confirmar Contraseña</div>
            <div className="registro-input-container">
              <input
                type={passwordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirmar Contraseña"
                required
                className="registro-input"
              />
              <span className="registro-password-toggle" onClick={togglePasswordVisibility}>
                {passwordVisible ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>
            {passwordError && <p className="registro-error-message">{passwordError}</p>}
          </div>

          <div className="registro-form-group">
            <button
              type="button"
              className="registro-btn"
              disabled={emailError !== "" || passwordError !== ""}
              onClick={handleRegister}
            >
              REGISTRARSE
            </button>
          </div>

          <div className="registro-social-text">
            <p>Regístrate con</p>
            <div className="registro-social-buttons">
              <button className="registro-facebook">
                <FaFacebookF />
              </button>
              <button className="registro-google">
                <FcGoogle />
              </button>
            </div>
          </div>

          <div className="registro-bottom-text">
            ¿Ya tienes una cuenta?{" "}
            <a href="/Login/Login.jsx" className="registro-login-link">Inicia sesión</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;

