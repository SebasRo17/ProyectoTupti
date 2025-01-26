import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../Components/header/header';
import Footer from '../../Components/footer/footer';
import './configuraciones.css';
import jwtDecode from 'jwt-decode';
import ErrorPopup from '../../Components/ErrorPopup/ErrorPopup';
import { changePassword } from '../../Api/userApi'; // Añade esta línea
import SuccessPopup from '../../Components/SuccessPopup/SuccessPopup';

const Configuraciones = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: ""
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showErrorPopup, setShowErrorPopup] = useState(false); // Estado para el pop-up
    const [errorMessage, setErrorMessage] = useState(''); // Mensaje de error
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserData({
                    name: decoded.Nombre || "",
                    email: decoded.Email || ""
                });
            } catch (error) {
                //console.error('Error al decodificar el token:', error);
            }
        }
    }, []);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            setErrorMessage('Las contraseñas nuevas no coinciden');
            setShowErrorPopup(true);
            return;
        }
    
        try {
            const token = localStorage.getItem('jwtToken');
            const decoded = jwtDecode(token);
            
            await changePassword(
                decoded.IdUsuario,
                passwords.currentPassword,
                passwords.newPassword
            );
    
            setPasswords({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
    
            // Mostrar mensaje de éxito con el nuevo popup
            setSuccessMessage('Contraseña actualizada exitosamente');
            setShowSuccessPopup(true);
        } catch (error) {
            setErrorMessage(error.message);
            setShowErrorPopup(true);
        }
    };

    const closeErrorPopup = () => {
        setShowErrorPopup(false); // Cerrar el pop-up
    };

    const closeSuccessPopup = () => {
        setShowSuccessPopup(false);
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

            {/* Mostrar el ErrorPopup si está habilitado */}
            {showErrorPopup && <ErrorPopup message={errorMessage} onClose={closeErrorPopup} />}
            {showSuccessPopup && <SuccessPopup message={successMessage} onClose={closeSuccessPopup} />}
        </div>
    );
};

export default Configuraciones;
