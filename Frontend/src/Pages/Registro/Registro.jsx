import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import "./Registro.css";
import Login from '../Login/Login.jsx';
import { FcGoogle } from "react-icons/fc"; // Ícono de Google
import { FaFacebookF } from "react-icons/fa"; // Ícono de Facebook
import { HiEye, HiEyeOff } from "react-icons/hi"; // Iconos de ojo
import ReCAPTCHA from "react-google-recaptcha";



function Registro() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);

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
    const value = e.target.value;
    setConfirmPassword(value);
  
    if (value !== password) {
      setPasswordError("Las contraseñas no coinciden.");
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
    } else {
      setPasswordError(""); // Si ambas validaciones son correctas, elimina el mensaje de error
    }
  };

  const handleRegister = () => {
    if (!captchaVerified) {
      alert("Por favor, verifica el reCAPTCHA antes de registrarte.");
      return;
    }
    console.log("Usuario registrado:", { email, password, confirmPassword });
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setCaptchaVerified(false);
  };

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaVerified(true);
    } else {
      setCaptchaVerified(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-container-inner">
        <div className="registro-form-container">
          {/* Botón "Regresar" como flecha en círculo */}
          <div className="registro-back-button">
            <Link to="/" className="back-registro-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          </div>

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

          {/* reCAPTCHA Condicional */}
          {emailError === "" && passwordError === "" && email && password && confirmPassword && (
            <div className="registro-form-group">
              <ReCAPTCHA
                sitekey="6LeYz5EqAAAAAJvWbZOIS_CjZAtLw_zmZQycIvoZ"
                onChange={handleCaptchaChange}
              />
            </div>
          )}

          <div className="registro-form-group">
            <button
              type="button"
              className="registro-btn"
              disabled={!captchaVerified || emailError !== "" || passwordError !== ""}
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
            <Link to="/Login" className="signup-text">Iniciar Sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;
