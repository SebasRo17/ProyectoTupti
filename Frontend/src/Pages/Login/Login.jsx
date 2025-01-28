import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc"; // Ícono de Google
import { FaFacebookF } from "react-icons/fa"; // Ícono de Facebook
import { HiEye, HiEyeOff } from "react-icons/hi"; // Iconos de ojo
import { HiArrowLeft } from "react-icons/hi";
import "./Login.css";
import { loginUser } from '../../Api/loginUsers';
import "./responsiveLogin.css";
import jwtDecode from 'jwt-decode';
import ErrorPopup from '../../Components/ErrorPopup/ErrorPopup';

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userId, setUserId] = useState(null);
  const [errorPopupMessage, setErrorPopupMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.MODE === 'development' 
    ? import.meta.env.VITE_API_URL_DEVELOPMENT 
    : import.meta.env.VITE_API_URL_PRODUCTION;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== apiUrl) {
        return;
      }

      if (event.data && event.data.token) {
        try {
          const payload = jwtDecode(event.data.token);
          localStorage.setItem('jwtToken', event.data.token);
          const from = location.state?.from || (payload.isAdmin ? '/admin' : '/');
          navigate(from);
        } catch (error) {
          console.error('Error procesando el token:', error);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate, location, apiUrl]);

  useEffect(() => {
    // Inicializar el SDK de Facebook
    window.fbAsyncInit = function() {
      FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/es_LA/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  const handleFacebookLogin = () => {
    const facebookAuthUrl = process.env.NODE_ENV === 'production'
      ? 'https://proyectotupti.onrender.com/auth/facebook'
      : 'http://localhost:3000/auth/facebook';
      console.log(facebookAuthUrl);
    const width = 600;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const loginWindow = window.open(
      facebookAuthUrl,
      'Facebook Login',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const handleMessage = async (event) => {
      const allowedOrigins = [
        'https://tupti.store',
        'https://www.tupti.store',
        'http://localhost:5173'
      ];

      if (!allowedOrigins.includes(event.origin)) {
        console.error('Origen no permitido:', event.origin);
        return;
      }

      try {
        if (event.data.type === 'AUTH_SUCCESS' && event.data.token) {
          localStorage.setItem('jwtToken', event.data.token);
          const payload = jwtDecode(event.data.token);
          const from = location.state?.from || (payload.isAdmin ? '/admin' : '/');
          navigate(from);
        }
      } catch (error) {
        console.error('Error al procesar el mensaje:', error);
      } finally {
        window.removeEventListener('message', handleMessage);
        if (loginWindow && !loginWindow.closed) {
          loginWindow.close();
        }
      }
    };

    window.addEventListener('message', handleMessage);

    const checkWindow = setInterval(() => {
      if (loginWindow && loginWindow.closed) {
        clearInterval(checkWindow);
        window.removeEventListener('message', handleMessage);
        console.log('Ventana de login cerrada');
      }
    }, 1000);
  };

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const authUrl = process.env.NODE_ENV === 'production'
      ? 'https://proyectotupti.onrender.com/auth/google'
      : 'http://localhost:3000/auth/google';

    const popup = window.open(
      authUrl,
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    window.addEventListener('message', (event) => {
      const allowedOrigins = [
        'https://tupti.store',
        'http://localhost:5173'
      ];

      if (allowedOrigins.includes(event.origin) && event.data.token) {
        localStorage.setItem('jwtToken', event.data.token);
        const payload = jwtDecode(event.data.token);
        const from = location.state?.from || '/';
        navigate(from);
      }
    });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError("Por favor, ingresa un correo electrónico válido.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      
      if (response.success) {
        localStorage.setItem('jwtToken', response.token);
        const decodedToken = jwtDecode(response.token);
        console.log('Token descifrado:', decodedToken);
        const { isAdmin } = decodedToken;
        const from = location.state?.from || (isAdmin ? '/admin' : '/');
        navigate(from);
      }
    } catch (error) {
      setErrorPopupMessage(error.message || 'Error al iniciar sesión');
      setShowErrorPopup(true);
    }
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
    setErrorPopupMessage("");
  };

  return (
    <div className="login-container">
      {showErrorPopup && <ErrorPopup message={errorPopupMessage} onClose={closeErrorPopup} />}
      <div className="login-card">
        {/* Botón "Regresar" como flecha en círculo */}
        <div className="login-back-button">
          <Link to="/" className="back-login-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon-arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        </div>

        <h1>LOGIN</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <div className="input-container">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <input
                onChange={handleEmailChange}
                type="text"
                placeholder="Correo electrónico"
                value={email}
              />
            </div>
            {emailError && <p className="login-error-message">{emailError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-container">
              <span className="input-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0110 0v4"></path>
                </svg>
              </span>
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
              />
              <span className="password-login-toggle" onClick={togglePasswordVisibility}>
                {passwordVisible ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>
            {passwordError && <p className="login-error-message">{passwordError}</p>}
          </div>

          <div className="form-group">
            
          </div>

          <div className="forgot-password">
            <Link to="/olvido-contrasena">¿Olvidaste tu contraseña?</Link>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={emailError !== "" || passwordError !== ""}
          >
            LOGIN
          </button>
        </form>

        <div className="social-login">
          <p>Regístrate con</p>
          <div className="social-buttons">
            <button className="login-facebook" onClick={handleFacebookLogin}>
              <FaFacebookF />
            </button>
            <button className="login-google" onClick={handleGoogleLogin}>
              <FcGoogle />
            </button>
          </div>
        </div>

        <div className="signup-link">
          <p>¿No tienes una cuenta?</p>
          <Link to="/Registro" className="signup-text">Regístrate</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;