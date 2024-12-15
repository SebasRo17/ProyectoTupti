import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './barraLateralAdmin.css';
import PantallaAdmin from '../../Pages/pantallaAdmin/pantallaAdmin';
//import ProductosAdmin from '../../Pages/productosAdmin/productosAdmin';

const BarraLateralAdmin = () => {
  return (
    <div className="barra-lateral-admin">
      <div className="barra-lateral-logo">
      <img 
          src="https://res.cloudinary.com/dd7etqrf2/image/upload/v1732717569/tupti_3_r82cww.svg" 
          alt="TUPTI" 
          className="logo-imagen" 
        />
      </div>
      <nav className="barra-lateral-nav">
        <ul>
        <li>
            <Link to="/admin">📊 Dashboard</Link>
          </li>
           <li>
           <Link to="/ProductosAdmin">🛒 Productos</Link>
          </li>
          <li><a href="#categorias">📂 Categorías</a></li>
          <li><a href="#pedidos">📦 Pedidos</a></li>
          <li><a href="#usuarios">👤 Usuarios</a></li>
          <li><a href="#configuracion">⚙️ Configuración</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default BarraLateralAdmin;
