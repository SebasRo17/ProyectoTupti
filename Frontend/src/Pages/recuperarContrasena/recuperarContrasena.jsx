import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./recuperarContrasena.css";
import { HiEye, HiEyeOff } from "react-icons/hi"; // Iconos para mostrar/ocultar contraseña




function RecuperarContrasena() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Revalidar al cambiar la contraseña principal
    if (confirmPassword && value !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
    } else if (value.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    // Validación al cambiar la confirmación
    if (value !== password) {
      setPasswordError("Las contraseñas no coinciden.");
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
    } else {
      setPasswordError(""); // Eliminar error si ambas validaciones son correctas
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordError && password && confirmPassword) {
      console.log("Nueva contraseña establecida:", password);
      // Aquí puedes agregar la lógica para enviar la nueva contraseña al servidor
    } else {
      setPasswordError("Por favor, corrige los errores antes de continuar.");
    }
  };

  // Comprobar si el botón debe estar deshabilitado
  const isButtonDisabled = 
    passwordError !== "" || password.length < 6 || confirmPassword.length < 6 || password !== confirmPassword;

  return (
    <div className="recuperar-container">
      <div className="recuperar-card">
        {/* Botón de regreso */}
        <div className="recuperar-back-button">
          <Link to="/" className="back-recuperar-circle">
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

        <h1>CAMBIAR CONTRASEÑA</h1>

        <form className="recuperar-form" onSubmit={handleSubmit}>
          {/* Nueva Contraseña */}
          <div className="form-group">
            <label>Nueva Contraseña</label>
            <div className="input-container">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Nueva Contraseña"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {passwordVisible ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <div className="input-container">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {passwordVisible ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>

          {/* Botón de cambiar contraseña */}
          <button type="submit" className="recuperar-button" disabled={isButtonDisabled}>
            Cambiar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecuperarContrasena;
