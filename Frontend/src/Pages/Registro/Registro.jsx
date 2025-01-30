import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import "./Registro.css";
import { FcGoogle } from "react-icons/fc"; // Ícono de Google
import { FaFacebookF } from "react-icons/fa"; // Ícono de Facebook
import { HiEye, HiEyeOff } from "react-icons/hi"; // Iconos de ojo
import ReCAPTCHA from "react-google-recaptcha";
import { registerUser } from '../../Api/userApi';
import "./responsiveRegistro.css";
const apiUrl = import.meta.env.MODE === 'development' 
  ? import.meta.env.VITE_API_URL_DEVELOPMENT 
  : import.meta.env.VITE_API_URL_PRODUCTION;


function Registro() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [nombre, setNombre] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registroError, setRegistroError] = useState("");
  const [emailExistsError, setEmailExistsError] = useState("");

  const handleNombreChange = (e) => {
    setNombre(e.target.value);
  };
  
  const handleRegister = async () => {
    if (!captchaVerified) {
      alert("Por favor, verifica el reCAPTCHA antes de registrarte.");
      return;
    }

    if (!nombre || !email || !password) {
      setRegistroError("Todos los campos son requeridos");
      return;
    }

    setIsLoading(true);
    setRegistroError("");
    setEmailExistsError(""); // Limpiar error previo

    try {
      const userData = {
        nombre: nombre,
        email: email,
        contrasenia: password
      };

      const response = await registerUser(userData);
      
      if (response.success) {
        // Limpiar formulario
        setNombre("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setCaptchaVerified(false);
         
        // Redirigir o mostrar mensaje de éxito
        alert("Registro exitoso!");
        window.location.href = '/login';
      }
    } catch (error) {
      if (error.message === 'El correo electrónico ya está registrado') {
        setEmailExistsError(error.message);
      } else {
        setRegistroError(error.message || "Error al registrar usuario");
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin === import.meta.env.VITE_API_URL && event.data.token) {
        //console.log('Token JWT:', event.data.token);
        // Guardar el token en el almacenamiento local
        localStorage.setItem('jwtToken', event.data.token);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
  
    if (value !== password) {
      setPasswordError("Las contraseñas no coinciden.");
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
    } else {
      setPasswordError(""); // Si ambas validaciones son correctas, elimina el mensaje de error
    }
  };

  // const handleRegister = async () => {
  //   if (!captchaVerified) {
  //     alert("Por favor, verifica el reCAPTCHA antes de registrarte.");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });
  //     //console.log("Usuario registrado:", { email, password, confirmPassword });
  //     setEmail("");
  //     setPassword("");
  //     setConfirmPassword("");
  //     setCaptchaVerified(false);
  //   } catch (error) {
  //     //console.error('Error durante el registro:', error);
  //   }
  // };

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaVerified(true);
    } else {
      setCaptchaVerified(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-container-inner">
        <div className="registro-form-container">
          {/* Botón "Regresar" como flecha en círculo */}
          <div className="registro-back-button">
            <Link to="/" className="back-registro-circle">
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

          <div className="registro-form-title">
            <h2>REGISTRARSE</h2>
          </div>

          <div className="registro-form-group">
            <div className="registro-field-title">Nombre completo</div>
            <div className="registro-input-container">
              <input
                type="text"
                value={nombre}
                onChange={handleNombreChange}
                placeholder="Nombre completo"
                required
                className="registro-input"
              />
            </div>
          </div>

          <div className="registro-form-group">
            <div className="registro-field-title">Usuario</div>
            <div className="registro-input-container">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Correo electrónico"
                required
                className="registro-input"
              />
              {emailError && <p className="registro-error-message">{emailError}</p>}
              {emailExistsError && <p className="registro-error-message">{emailExistsError}</p>}
            </div>
          </div>

          <div className="registro-form-group">
            <div className="registro-field-title">Contraseña</div>
            <div className="registro-input-container">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Contraseña"
                required
                className="registro-input"
              />
              <span className="registro-password-toggle" onClick={togglePasswordVisibility}>
                {passwordVisible ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>
          </div>

          <div className="registro-form-group">
            <div className="registro-field-title">Confirmar Contraseña</div>
            <div className="registro-input-container">
              <input
                type={passwordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirmar Contraseña"
                required
                className="registro-input"
              />
              <span className="registro-password-toggle" onClick={togglePasswordVisibility}>
                {passwordVisible ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>
            {passwordError && <p className="registro-error-message">{passwordError}</p>}
          </div>

          {/* reCAPTCHA Condicional */}
          {emailError === "" && passwordError === "" && email && password && confirmPassword && (
            <div className="registro-form-group">
              <ReCAPTCHA
                sitekey="6LdWNJIqAAAAAGbK-oasKJ26wLYuigXLiFEtyUva"
                onChange={handleCaptchaChange}
              />
            </div>
          )}

          <div className="registro-form-group">
          <button
  type="button"
  className="registro-btn"
  disabled={isLoading || !captchaVerified || emailError !== "" || passwordError !== ""}
  onClick={handleRegister}
>
  {isLoading ? "registrado..." : "REGISTRARSE"}
</button>

          </div>

          <div className="registro-social-text">
            <p>Regístrate con</p>
            <div className="registro-social-buttons">
              <button className="registro-facebook" onClick={handleFacebookLogin}>
                <FaFacebookF />
              </button>
              <button className="registro-google" onClick={handleGoogleLogin}>
                <FcGoogle />
              </button>
            </div>
          </div>

          <div className="registro-bottom-text">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/Login" className="signup-text">Iniciar Sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;
