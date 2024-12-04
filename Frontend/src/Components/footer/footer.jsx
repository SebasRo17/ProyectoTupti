import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Sección de contacto */}
        <div className="footer-column" id="contacto">
          <h4>TUPTI</h4>
          <p>Quito - Ecuador</p>
          <p>(+593) 998 616 470</p>
          <p>support@tupti.com</p>
        </div>

        {/* Sección de categorías */}
        <div className="footer-column" id="categoria">
          <h4>Top Categorías</h4>
          <ul>
            <li>Electrónicos</li>
            <li>Accesorios</li>
            <li>Hogar</li>
            <li>Ropa</li>
          </ul>
        </div>

        {/* Enlaces rápidos */}
        <div className="footer-column" id="enlace">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#">Política de Privacidad</a></li>
            <li><a href="#">Términos de Uso</a></li>
            <li><a href="#">Ayuda</a></li>
            <li><a href="#contactanos">Contáctanos</a></li>
          </ul>
        </div>

        {/* Botones de aplicaciones */}
        <div className="footer-column" id="botones">
          <h4>Encuéntranos</h4>
          <div className="app-buttons">
            <button>Google Play</button>
            <button>App Store</button>
          </div>
        </div>

        {/* Etiquetas populares */}
        <div className="footer-column" id="etiqueta">
          <h4>Etiquetas Populares</h4>
          <div className="tag-container">
            <span className="tag">Tech</span>
            <span className="tag">Moda</span>
            <span className="tag">Gaming</span>
            <span className="tag">Ofertas</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
