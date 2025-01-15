import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './nuevoDescuento.css';

const NuevoDescuento = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        idProducto: '',
        nombreProducto: '',
        porcentajeDescuento: '',
        estado: 'Activo',
        fechaInicio: '',
        fechaFin: '',
        aplicarCategoria: false
      });
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProductName = async (id) => {
    try {
      const response = await axios.get(`https://proyectotupti.onrender.com/productos/${id}`);
      setFormData(prev => ({
        ...prev,
        nombreProducto: response.data.Nombre
      }));
    } catch (error) {
      setError('Error al cargar el producto');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'idProducto' && value) {
      fetchProductName(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://proyectotupti.onrender.com/descuentos', formData);
      onClose();
    } catch (error) {
      setError('Error al crear el descuento');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay6" onClick={onClose} />
      <div className="nuevo-descuento-modal">
        <h2>Nuevo Descuento</h2>
        <form onSubmit={handleSubmit} className="nuevo-descuento-form">
          <div className="form-group6">
            <label>ID Producto:</label>
            <input
              type="text"
              name="idProducto"
              value={formData.idProducto}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group6">
            <label>Producto:</label>
            <input
              type="text"
              value={formData.nombreProducto}
              disabled
            />
          </div>

          <div className="form-group6">
            <label>Categoria:</label>
            <input
              type="text"
              value={formData.nombreProducto}
              disabled
            />
          </div>

          <div className="form-group6">
            <label>Porcentaje de Descuento:</label>
            <input
              type="number"
              name="porcentajeDescuento"
              value={formData.porcentajeDescuento}
              onChange={handleInputChange}
              min="0"
              max="100"
              required
            />
          </div>

          <div className="form-group6">
            <label>Estado:</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              required
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

        <div className="checkbox-container">
        <input
            type="checkbox"
            id="aplicarCategoria"
            name="aplicarCategoria"
            checked={formData.aplicarCategoria}
            onChange={(e) => setFormData({
                ...formData,
                aplicarCategoria: e.target.checked
            })}
            />
            <label htmlFor="aplicarCategoria">Agregar a toda la categoría</label>
        </div>


          <div className="form-group6">
            <label>Fecha Inicio:</label>
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group6">
            <label>Fecha Fin:</label>
            <input
              type="date"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleInputChange}
              required
            />
          </div>

          {error && <div className="error-message6">{error}</div>}

          <div className="form-actions6">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NuevoDescuento;