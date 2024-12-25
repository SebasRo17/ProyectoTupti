import React from "react";
import { Link } from "react-router-dom";
import './headerPago.css'; // Importamos los estilos
import TuptiPage from '../../Pages/pantallaPrincipal/pantallaPrincipal';

const HeaderPagos = () => {
  return (
    <header className="header-pagos">
      {/* Logo */}
      <div className="logoPago">
        <Link to="/">
        <button className='btnLogo'>
          <img 
            src="https://res.cloudinary.com/dd7etqrf2/image/upload/v1734134733/tupti_4_i0nwzz.png" 
            alt="TUPTI" 
            className="logo-imagen" 
          />
        </button>
      </Link>
      </div>
    </header>
  );
};

export default HeaderPagos;
