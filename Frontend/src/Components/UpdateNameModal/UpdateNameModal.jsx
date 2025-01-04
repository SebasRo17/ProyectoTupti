import React, { useState } from 'react';
import './UpdateNameModal.css';
import { updateUserName } from '../../Api/userApi';

function UpdateNameModal({ userId, onClose }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserName(userId, name);
      console.log('Respuesta del servidor:', response);
      if (response.Nombre) {
        onClose();
      } else {
        setError(response.message || 'Error al actualizar el nombre');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error al actualizar el nombre');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Actualizar Nombre</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ingresa tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Actualizar</button>
        </form>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

export default UpdateNameModal;
