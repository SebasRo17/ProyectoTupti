
import React from 'react';
import { useNavigate } from 'react-router-dom';

function PantallaAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes agregar la lógica para cerrar sesión
    navigate('/');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Panel de Administración</h1>
      <div style={{ marginTop: '20px' }}>
        <h2>Bienvenido Administrador</h2>
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <button onClick={() => navigate('/users')}>Gestionar Usuarios</button>
          <button onClick={() => navigate('/products')}>Gestionar Productos</button>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </div>
    </div>
  );
}

export default PantallaAdmin;