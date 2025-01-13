import React, { useState, useEffect } from 'react'; // Añadir useEffect
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../Components/header/header';
import Footer from '../../Components/footer/footer';
import './configuraciones.css';
import jwtDecode from 'jwt-decode'; // Importar jwt-decode
import ErrorPopup from '../../Components/ErrorPopup/ErrorPopup';

 

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

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setErrorMessage('Las contraseñas nuevas no coinciden');
            setShowErrorPopup(true); // Mostrar el pop-up de error
            return;
        }
        // Aquí iría la lógica para actualizar la contraseña en la API
        //console.log('Actualizando contraseña...');
    };

    const closeErrorPopup = () => {
        setShowErrorPopup(false); // Cerrar el pop-up
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
        </div>
    );
};

export default Configuraciones;
