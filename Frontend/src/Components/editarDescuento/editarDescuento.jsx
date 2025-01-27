import React, { useState } from 'react';
import './editarDescuento.css';
import { updateDiscount } from '../../Api/descuentosApi';

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  try {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  } catch {
    return '';
  }
};

const EditarDescuento = ({ descuento, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: descuento.id,
    producto: descuento.producto,
    porcentaje: descuento.descuento,
    estado: descuento.estado,
    fechaInicio: formatDateForInput(descuento.fechaInicio),
    fechaFin: formatDateForInput(descuento.fechaFin)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const discountData = {
        porcentaje: formData.porcentaje,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        activo: formData.estado === "Activo"
      };
      
      console.log('ID del descuento:', descuento.id); // Verifica este valor
      await updateDiscount(descuento.id, discountData);
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error updating discount:', error);
    }
  };

  return (
    <div className="modal-wrapper2">
      <div className="modal-overlay2" onClick={onClose} />
      <div className="modal-content2">
        <h3>Editar Descuento</h3>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
        <label>Producto o Categoria:</label>
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
              <option value="Inactivo">Inactivo</option>
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