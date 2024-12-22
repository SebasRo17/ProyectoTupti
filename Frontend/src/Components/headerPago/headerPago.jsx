import React from "react";
import { Link } from "react-router-dom";
import './headerPago.css'; // Importamos los estilos

const HeaderPagos = () => {
  return (
    <header className="header-pagos">
      {/* Logo */}
      <div className="logoPago">
            <img
              src="https://res.cloudinary.com/dd7etqrf2/image/upload/v1734134733/tupti_4_i0nwzz.png"
              alt="TUPTI"
              className="logoPago-imagen"
            />
      </div>
    </header>
  );
};

export default HeaderPagos;
