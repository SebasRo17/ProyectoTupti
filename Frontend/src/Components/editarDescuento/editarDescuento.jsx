import React, { useState } from 'react';
import './editarDescuento.css';

const EditarDescuento = ({ descuento, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    producto: descuento.producto,
    porcentaje: descuento.descuento,
    estado: descuento.estado,
    fechaInicio: descuento.fechaInicio,
    fechaFin: descuento.fechaFin
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-wrapper">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <h3>Editar Descuento</h3>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
        <label>Producto:</label>
        <input
            type="text"
            value={descuento.producto}
            disabled
            className="product-name-input"
        />
        </div>

          <div className="form-group">
            <label>Porcentaje de Descuento:</label>
            <input
              type="number"
              value={formData.porcentaje}
              onChange={(e) => setFormData({...formData, porcentaje: e.target.value})}
              min="0"
              max="100"
              required
            />
          </div>

          <div className="form-group">
            <label>Estado:</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
              required
            >
              <option value="Activo">Activo</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fecha Inicio:</label>
            <input
              type="date"
              value={formData.fechaInicio}
              onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Fecha Fin:</label>
            <input
              type="date"
              value={formData.fechaFin}
              onChange={(e) => setFormData({...formData, fechaFin: e.target.value})}
              required
            />
          </div>

          <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save-btn">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarDescuento;