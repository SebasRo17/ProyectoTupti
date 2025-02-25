import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./olvidoContrasena.css";
import "./responsiveolvidoContrasena.css";
import { resetApi } from '../../Api/resetApi';

function OlvidoContrasena() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Estado para habilitar/deshabilitar el botón
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validación del correo electrónico
  const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(value)) {
      setEmailError("Por favor, ingresa un correo válido.");
      setIsButtonDisabled(true); // Deshabilitar el botón si el correo no es válido
    } else {
      setEmailError(""); // Limpiar el mensaje de error si es válido
      setIsButtonDisabled(false); // Habilitar el botón si el correo es válido
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const response = await resetApi.requestPasswordReset(email);
      setMessage(response.message || "Si el correo existe, recibirás instrucciones para restablecer tu contraseña.");
      setEmail(""); // Limpiar el campo después de éxito
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setMessage(error.message || "Ocurrió un error al procesar tu solicitud.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="olvido-container">
      <div className="olvido-card">
        {/* Botón "Regresar" con flecha en círculo */}
        <div className="olvido-back-button">
          <Link to="/" className="back-olvido-circle">
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

        <h1>Recuperar Contraseña</h1>

        {/* Mensaje debajo del título */}
        <p className="message-info">
          Escribe la dirección de correo electrónico vinculada a tu cuenta y te enviaremos un mensaje.
        </p>

        {message && <p className="message-info">{message}</p>}

        <form className="olvido-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <div className="input-container">
              <span className="input-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={handleEmailChange}
                className={emailError ? "input-error" : ""}
                required
              />
            </div>
            {emailError && <p className="login-error-message">{emailError}</p>} {/* Mensaje de error */}
          </div>

          <button 
            type="submit" 
            className="olvido-button" 
            disabled={isButtonDisabled || isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar Correo"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OlvidoContrasena;