import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './barraLateralAdmin.css';

const BarraLateralAdmin = () => {
  return (
    <div className="barra-lateral-admin">
      <div className="barra-lateral-logo">
        <h1>TUPTI</h1>
      </div>
      <nav className="barra-lateral-nav">
        <ul>
          <li><a href="#dashboard">📊 Dashboard</a></li>
          <li><a href="#productos">🛒 Productos</a></li>
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
