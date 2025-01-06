import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './barraLateralAdmin.css';
import { useNavigate } from 'react-router-dom';
import PantallaAdmin from '../../Pages/pantallaAdmin/pantallaAdmin';
//import ProductosAdmin from '../../Pages/productosAdmin/productosAdmin';

const BarraLateralAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('idUsuario');
    navigate('/');
  };
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
          <li><Link to="/DescuentosAdmin">💰 Descuentos</Link></li>
          <li><Link to="/PedidosAdmin">📦 Pedidos</Link></li>
          <li><Link to="/UsuariosAdmin">👤 Usuarios</Link></li>
          <li>
            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              🚪 Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default BarraLateralAdmin;
