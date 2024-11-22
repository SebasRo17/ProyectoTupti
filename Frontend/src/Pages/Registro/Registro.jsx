import React from "react";
import "./Registro.css";
import { FcGoogle } from "react-icons/fc"; // Ícono de Google
import { FaFacebookF } from "react-icons/fa"; // Ícono de Facebook

function App() {
  return (
    <div className="App">
      <div className="modal-overlay">
        <div className="modal">
          {/* Sección izquierda */}
          <div className="modal-left">
            <h1>Bienvenido a Tupti</h1>
            <h2>1</h2>
            <p>“Todo lo que necesitas directo a tu puerta”</p>
          </div>

          {/* Sección derecha */}
          <div className="modal-right">
            <h2>Regístrate</h2>
            <form>
              <input type="text" placeholder="Nombre y Apellido" required />
              <input
                type="text"
                placeholder="Documento de Identidad "
                pattern="\d{10}"
                title="Ingrese un número de cédula válido (10 dígitos)"
                required
              />
              <input type="email" placeholder="Correo electrónico" required />
              <input type="password" placeholder="Contraseña" required />
              <button type="submit">Regístrate</button>
            </form>
            <p>
              ¿Ya tienes una cuenta? <a href="#">Inicia sesión</a>
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

export default App;