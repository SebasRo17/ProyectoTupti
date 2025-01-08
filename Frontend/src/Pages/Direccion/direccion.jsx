import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/header/header';
import Footer from '../../Components/footer/footer';
import GoogleMaps from '../../Api/googleMaps.jsx';
import jwtDecode from 'jwt-decode';
import { createDireccion } from '../../Api/direccionApi';
import './direccion.css';

const Direccion = () => {
  const navigate = useNavigate();
  const [direccion, setDireccion] = useState({
    callePrincipal: '',
    numeracion: '',
    calleSecundaria: '',
    ciudad: '',
    provincia: '',
    barrio: '',
    pais: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [idUsuario, setIdUsuario] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    // Obtener y decodificar el token al cargar el componente
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const payload = jwtDecode(token);
        setIdUsuario(payload.user.IdUsuario);
      } catch (error) {
        //console.error('Error decodificando el token:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDireccion((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleSaveLocation = async () => {
    try {
      if (!idUsuario) {
        alert('Debe iniciar sesión para guardar una dirección');
        return;
      }

      const direccionData = {
        IdUsuario: idUsuario,
        CallePrincipal: direccion.callePrincipal,
        Numeracion: direccion.numeracion,
        CalleSecundaria: direccion.calleSecundaria,
        Vecindario: direccion.barrio,
        Ciudad: direccion.ciudad,
        Provincia: direccion.provincia,
        Pais: direccion.pais,
        Descripcion: locationName
      };

      // Validar campos requeridos
      const camposRequeridos = Object.entries(direccionData);
      for (const [campo, valor] of camposRequeridos) {
        if (!valor) {
          alert(`El campo ${campo} es requerido`);
          return;
        }
      }

      const response = await createDireccion(direccionData);
      if (response) {
        setShowModal(false);
        setShowConfirmModal(true); // Mostrar modal de confirmación
      }
    } catch (error) {
      //console.error('Error al guardar la dirección:', error);
      alert('Error al guardar la dirección: ' + (error.message || 'Error desconocido'));
    }
  };

  return (
    <div className="page-container">
      <Header toggleCart={toggleCart} isCartOpen={isCartOpen} />
      <div className="direccion-container">
        <div className="form-container">
          <div className="form-group">
            <label>Calle principal:</label>
            <input
              type="text"
              name="callePrincipal"
              value={direccion.callePrincipal}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Numeración:</label>
            <input
              type="text"
              name="numeracion"
              value={direccion.numeracion}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Calle Secundaria:</label>
            <input
              type="text"
              name="calleSecundaria"  // Corregido de callesSecundaria a calleSecundaria
              value={direccion.calleSecundaria}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Vecindario:</label>
            <input
              type="text"
              name="barrio"
              value={direccion.barrio}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Ciudad:</label>
            <input
              type="text"
              name="ciudad"
              value={direccion.ciudad}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Provincia:</label>
            <input
              type="text"
              name="provincia"
              value={direccion.provincia}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>País:</label>
            <input
              type="text"
              name="Pais"
              value={direccion.pais}
              onChange={handleChange}
            />
          </div>
          <div className="button-container">
            <button className="btn-agregar" onClick={() => setShowModal(true)}>
              Agregar Dirección
            </button>
            <button
              className="btn-cancelar"
              onClick={() => window.history.back()}
            >
              Cancelar
            </button>
          </div>
        </div>

        <div className="map-container">
        <GoogleMaps onAddressChange={(newAddress) => setDireccion(prev => ({ ...prev, ...newAddress }))} />
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>¿Cómo deseas llamar esta dirección?</h3>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Nombre de la ubicación"
            />
            <div className="modal-buttons">
              <button onClick={handleSaveLocation}>Guardar</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>¡Dirección guardada exitosamente!</h3>
            <div className="modal-buttons">
              <button 
                onClick={() => {
                  setShowConfirmModal(false);
                  navigate('/');
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer moved outside of direccion-container */}
      <Footer />
    </div>
  );
};

export default Direccion;
