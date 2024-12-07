import React from 'react';
import { useNavigate } from 'react-router-dom';

function PantallaAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar cualquier dato de sesión si existe
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={{ 
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        color: '#333',
        marginBottom: '30px' 
      }}>Panel de Administración</h1>
      
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ color: '#666' }}>Bienvenido Administrador</h2>
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginTop: '30px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => navigate('/users')}
            style={buttonStyle}
          >
            Gestionar Usuarios
          </button>
          <button 
            onClick={() => navigate('/products')}
            style={buttonStyle}
          >
            Gestionar Productos
          </button>
          <button 
            onClick={handleLogout}
            style={{...buttonStyle, backgroundColor: '#dc3545'}}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '12px 24px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s'
};

export default PantallaAdmin;