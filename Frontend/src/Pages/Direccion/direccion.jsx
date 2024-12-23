import React, { useState } from 'react';
import Header from '../../Components/header/header';
import Footer from '../../Components/footer/footer';
import GoogleMaps from '../../Api/googleMaps.jsx';
import './direccion.css';

const Direccion = () => {
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
  const handleSaveLocation = () => {
    console.log('Saving location:', { direccion, name: locationName });
    setShowModal(false);
    setLocationName('');
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
              name="callesSecundaria"
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
      {/* Footer moved outside of direccion-container */}
      <Footer />
    </div>
  );
};

export default Direccion;
