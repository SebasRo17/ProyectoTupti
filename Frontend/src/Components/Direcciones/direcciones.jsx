import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../Components/header/header';
import Footer from '../../Components/footer/footer';
import { getDireccionesByUserId } from '../../Api/direccionApi';
import jwt_decode from 'jwt-decode';
import './direcciones.css';

const DireccionesGuardadas = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [direccionesGuardadas, setDireccionesGuardadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDirecciones = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const decodedToken = jwt_decode(token);
        console.log('Token decodificado:', decodedToken);
        
        // Obtener el ID del usuario de la estructura correcta del token
        const userId = decodedToken.user.IdUsuario;
        console.log('ID de usuario:', userId);

        if (!userId) {
          throw new Error('No se pudo obtener el ID del usuario');
        }

        const direcciones = await getDireccionesByUserId(userId);
        console.log('Direcciones recibidas:', direcciones);
        
        if (Array.isArray(direcciones)) {
          setDireccionesGuardadas(direcciones);
        } else {
          console.error('Las direcciones no son un array:', direcciones);
          setDireccionesGuardadas([]);
        }
      } catch (error) {
        console.error('Error detallado al cargar direcciones:', error);
        setError('No se pudieron cargar las direcciones: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDirecciones();
  }, [navigate]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  if (isLoading) return <div>Cargando direcciones...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="page-container" style={{ minHeight: '100vh' }}>
      <Header toggleCart={toggleCart} isCartOpen={isCartOpen} />
      <div className="direcciones-container" style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Direcciones Guardadas</h1>
        <div className="direcciones-list">
          {direccionesGuardadas.length === 0 ? (
            <p>No hay direcciones guardadas</p>
          ) : (
            direccionesGuardadas.map((direccion, index) => (
              <div key={index} className="direccion-card" style={{ 
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                margin: '10px 0',
                backgroundColor: '#fff'
              }}>
                <h2>{direccion.Descripcion}</h2>
                <div className="direccion-detalles">
                  <p><strong>Calle Principal:</strong> {direccion.CallePrincipal}</p>
                  <p><strong>Numeración:</strong> {direccion.Numeracion}</p>
                  <p><strong>Calle Secundaria:</strong> {direccion.CalleSecundaria}</p>
                  <p><strong>Barrio:</strong> {direccion.Vecindario}</p>
                  <p><strong>Ciudad:</strong> {direccion.Ciudad}</p>
                  <p><strong>Provincia:</strong> {direccion.Provincia}</p>
                  <p><strong>País:</strong> {direccion.Pais}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DireccionesGuardadas;