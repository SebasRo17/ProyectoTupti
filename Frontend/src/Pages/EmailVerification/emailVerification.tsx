import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmailToken } from '../../Api/emailVerificationApi';
import './emailVerification.css';


const EmailVerification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando tu correo electrónico...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          setStatus('error');
          setMessage('Token no proporcionado');
          return;
        }

        const response = await verifyEmailToken(token);
        setStatus('success');
        setMessage(response.message);
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Error al verificar el correo');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <>
      <div className="verification-container">
        <div className="verification-card">
          {status === 'loading' && (
            <div className="verification-loading">
              <div className="spinner"></div>
              <p>{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="verification-success">
              <i className="fas fa-check-circle"></i>
              <h2>¡Verificación Exitosa!</h2>
              <p>{message}</p>
              <p className="redirect-message">
                Serás redirigido al inicio de sesión en unos segundos...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="verification-error">
              <i className="fas fa-times-circle"></i>
              <h2>Error de Verificación</h2>
              <p>{message}</p>
              <button onClick={() => navigate('/login')} className="login-button">
                Ir al inicio de sesión
              </button>
            </div>
          )}
        </div>
      </div>

    </>
  );
};

export default EmailVerification;