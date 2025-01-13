import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/header/header';
import Footer from '../../Components/footer/footer';
import GoogleMaps from '../../Api/googleMaps.jsx';
import jwtDecode from 'jwt-decode';
import { createDireccion } from '../../Api/direccionApi';
import './direccion.css';
import ErrorPopup from '../../Components/ErrorPopup/ErrorPopup';

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
  const [direccionBuscada, setDireccionBuscada] = useState('');
  const [mapCenter, setMapCenter] = useState({
    lat: -0.1807,
    lng: -78.4678
  });
  const [marker, setMarker] = useState(null);
  
  // Estado para manejar errores
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const payload = jwtDecode(token);
        setIdUsuario(payload.user.IdUsuario);
      } catch (error) {
        console.error('Error decodificando el token:', error);
      }
    }
  }, []);

  useEffect(() => {
    const updateMapFromFields = async () => {
      const addressString = `${direccion.callePrincipal} ${direccion.numeracion}, ${direccion.barrio}, ${direccion.ciudad}, ${direccion.provincia}, ${direccion.pais}`;
      
      if (direccion.ciudad && direccion.provincia) {
        const geocoder = new window.google.maps.Geocoder();
        try {
          const results = await new Promise((resolve, reject) => {
            geocoder.geocode({ address: addressString }, (results, status) => {
              if (status === 'OK') {
                resolve(results);
              } else {
                reject(status);
              }
            });
          });

          const location = results[0].geometry.location;
          setMapCenter({
            lat: location.lat(),
            lng: location.lng()
          });
          setMarker({
            lat: location.lat(),
            lng: location.lng()
          });
        } catch (error) {
          console.log('No se pudo geocodificar la dirección:', error);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      updateMapFromFields();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [direccion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDireccion((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchAddress = async () => {
    if (!direccionBuscada) {
      alert('Por favor ingrese una dirección para buscar');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: direccionBuscada }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        setMapCenter({
          lat: location.lat(),
          lng: location.lng()
        });
        setMarker({
          lat: location.lat(),
          lng: location.lng()
        });

        const addressComponents = results[0].address_components;
        let callePrincipal = '', numeracion = '', calleSecundaria = '', ciudad = '', provincia = '', barrio = '', pais = '';
        
        addressComponents.forEach(component => {
          const types = component.types;
          if (types.includes('street_number')) {
            numeracion = component.long_name;
          } else if (types.includes('route')) {
            callePrincipal = component.long_name;
          } else if (types.includes('sublocality_level_1')) {
            calleSecundaria = component.long_name;
          } else if (types.includes('locality')) {
            ciudad = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            provincia = component.long_name;
          } else if (types.includes('neighborhood')) {
            barrio = component.long_name;
          } else if (types.includes('country')) {
            pais = component.long_name;
          }
        });

        setDireccion(prev => ({
          ...prev,
          callePrincipal,
          numeracion,
          calleSecundaria,
          ciudad,
          provincia,
          barrio,
          pais
        }));
      } else {
        alert('No se pudo encontrar la dirección');
      }
    });
  };

  const handleSaveLocation = async () => {
    try {
      if (!idUsuario) {
        throw new Error('Debe iniciar sesión para guardar una dirección');
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

      const camposRequeridos = Object.entries(direccionData);
      for (const [campo, valor] of camposRequeridos) {
        if (!valor) {
          throw new Error(`El campo ${campo} es requerido`);
        }
      }

      const response = await createDireccion(direccionData);
      if (response) {
        setShowModal(false);
        setShowConfirmModal(true);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Error desconocido');
      setShowErrorPopup(true);
    }
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  return (
    <div className="page-container">
      <Header toggleCart={toggleCart} isCartOpen={isCartOpen} />
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
              name="calleSecundaria"
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
              name="pais"
              value={direccion.pais}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Buscar Dirección:</label>
            <input
              type="text"
              value={direccionBuscada}
              onChange={(e) => setDireccionBuscada(e.target.value)}
              placeholder="Ingrese una dirección"
            />
          </div>
          <div className="button-container">
            <button className="btn-buscar" onClick={handleSearchAddress}>
              Buscar Dirección
            </button>
            <button className="btn-agregar" onClick={() => setShowModal(true)}>
              Agregar Dirección
            </button>
            <button className="btn-cancelar" onClick={() => window.history.back()}>
              Cancelar
            </button>
          </div>
        </div>

        <div className="map-container">
          <GoogleMaps
            mapCenter={mapCenter}
            marker={marker}
            onAddressChange={(newAddress) => setDireccion(prev => ({ ...prev, ...newAddress }))}
          />
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
            <h3>Dirección guardada correctamente.</h3>
            <button onClick={() => setShowConfirmModal(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Mostrar el pop-up de error */}
      {showErrorPopup && (
        <ErrorPopup
          message={errorMessage}
          onClose={() => setShowErrorPopup(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Direccion;
