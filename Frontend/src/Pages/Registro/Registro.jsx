import React from "react";
import { Link } from 'react-router-dom'
import "./Registro.css";

function Registro() {
  return (
    <div className="App">
      <div className="modal">
        <div className="modal-left">
          <h1>Bienvenido a Tupti</h1>
          <div className="icon-container">
            <h2>1</h2>
            <div className="icon-text">
              <p>“Todo lo que necesitas directo a tu puerta”
              </p>
            </div>
          </div>
        </div>
        <div className="modal-right">
          <h2>Regístrate</h2>
          <form>
            <input type="text" placeholder="Nombre y Apellido" required />
            <input type="email" placeholder="Correo electrónico" required />
            <input type="password" placeholder="Contraseña" required />
            <button type="submit">Regístrate</button>
          </form>
          <p>
            ¿Ya tienes una cuenta? <a href="#">Inicia sesión</a>
          </p>
          <div className="social-login">
            <button className="google">Continuar con Google</button>
            <button className="facebook">Continuar con Facebook</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;