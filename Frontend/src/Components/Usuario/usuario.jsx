import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../Components/header/header';
import Footer from '../../Components/footer/footer';
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import './usuario.css';

const Usuario = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    password: 'JHON'
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="user-profile-container">
      <Header />
      
      <main className="user-profile-content">
        <div className="profile-card">
          <div className="profile-image">
            <FaUser className="default-avatar" />
          </div>
          
          <div className="profile-details">
            <h2>Perfil de Usuario</h2>
            
            <div className="form-group">
              <label>Nombre:</label>
              <input 
                type="text" 
                value={userData.name}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                value={userData.email}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Teléfono:</label>
              <input 
                type="tel" 
                value={userData.phone}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Contraseña:</label>
              <div className="password-input">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={userData.password}
                  readOnly
                />
                <button 
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Usuario;