import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../Components/header/header';
import Footer from '../../Components/footer/footer';
import './configuraciones.css';

const Configuraciones = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
      };
    
  const userData = {
    name: "John Doe",
    email: "john@example.com"
  };

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('Las contraseñas nuevas no coinciden');
      return;
    }
    // API call logic here
    console.log('Actualizando contraseña...');
  };

  return (
    <div className="body">
      <Header toggleCart={toggleCart} isCartOpen={isCartOpen} />
      
      <main className="main-content">
        <div className="settings-container">
          <section className="user-profile-section">
            <h2>Información del Usuario</h2>
            <div className="user-info-container">
              <div className="info-item">
                <label>Nombre:</label>
                <input 
                  type="text" 
                  value={userData.name} 
                  disabled 
                  className="info-input"
                />
              </div>
              <div className="info-item">
                <label>Email:</label>
                <input 
                  type="email" 
                  value={userData.email} 
                  disabled 
                  className="info-input"
                />
              </div>
            </div>
          </section>

          <section className="password-section">
            <h2>Cambiar Contraseña</h2>
            <form onSubmit={handleUpdatePassword} className="password-form">
              <div className="form-group">
                <label>Contraseña actual:</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Contraseña nueva:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Repita la nueva contraseña:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <button type="submit" className="update-password-btn">
                Actualizar Contraseña
              </button>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Configuraciones;