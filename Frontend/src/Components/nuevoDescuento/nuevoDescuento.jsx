import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getProductDetails } from '../../Api/productosApi';
import { createDescuento } from '../../Api/descuentosApi';
import './nuevoDescuento.css';

const NuevoDescuento = ({ isOpen, onClose }) => {
  const initialState = {
    idProducto: '',
    nombreProducto: '',
    categoriaProducto: '',
    idTipoProducto: null,
    porcentajeDescuento: '',
    estado: 'Activo',
    fechaInicio: '',
    fechaFin: '',
    aplicarCategoria: false
  };

  const [formData, setFormData] = useState(initialState);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleBuscarProducto = async () => {
    try {
      const producto = await getProductDetails(formData.idProducto);
      console.log('Producto encontrado:', producto);
      setFormData(prev => ({
        ...prev,
        nombreProducto: producto.Nombre || '',
        categoriaProducto: producto.TipoProducto || '',
        idTipoProducto: producto.IdTipoProducto || null
      }));
    } catch (error) {
      alert(error.message || 'Producto no encontrado');
      setFormData(prev => ({
        ...prev,
        nombreProducto: '',
        categoriaProducto: '',
        idTipoProducto: null
      }));
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setFormData(prev => ({
      ...prev,
      fechaInicio: date ? date.toISOString() : ''
    }));
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setFormData(prev => ({
      ...prev,
      fechaFin: date ? date.toISOString() : ''
    }));
  };

  const resetForm = () => {
    setFormData(initialState);
    setStartDate(null);
    setEndDate(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestPayload = formData.aplicarCategoria 
        ? { 
            IdTipoProducto: formData.idTipoProducto, 
            Porcentaje: formData.porcentajeDescuento,
            FechaInicio: formData.fechaInicio,
            FechaFin: formData.fechaFin
          }
        : { 
            IdProducto: formData.idProducto, 
            Porcentaje: formData.porcentajeDescuento,
            FechaInicio: formData.fechaInicio,
            FechaFin: formData.fechaFin
          };

      await createDescuento(requestPayload);
      resetForm();
      onClose();
    } catch (error) {
      setError('Error al crear el descuento: ' + error.message);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({
      ...prev,
      aplicarCategoria: e.target.checked
    }));
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="modal-overlay6" onClick={handleCancel} />
    <div className="nuevo-descuento-modal">
      <h2>Nuevo Descuento</h2>
      <form onSubmit={handleSubmit} className="nuevo-descuento-form">
        <div className="form-group6">
          <label>ID Producto:</label>
          <input
            type="text"
            name="idProducto"
            value={formData.idProducto}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              idProducto: e.target.value 
            }))}
            required={!formData.aplicarCategoria}
            disabled={formData.aplicarCategoria}
          />
          <button 
            type="button" 
            onClick={handleBuscarProducto}
            disabled={formData.aplicarCategoria}
          >
            Buscar
          </button>
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
            value={formData.categoriaProducto}
            disabled
          />
        </div>

        <div className="form-group6">
          <label>Porcentaje de Descuento:</label>
          <input
            type="number"
            name="porcentajeDescuento"
            value={formData.porcentajeDescuento}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              porcentajeDescuento: e.target.value
            }))}
            min="0"
            max="100"
            required
          />
        </div>

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="aplicarCategoria"
            name="aplicarCategoria"
            checked={formData.aplicarCategoria}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="aplicarCategoria">Agregar a toda la categoría</label>
        </div>

        <div className="form-group6 date-picker-wrapper">
          <label>Fecha Inicio:</label>
          <div className="date-picker-container">
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Seleccionar fecha"
              className="date-input"
              calendarClassName="custom-calendar"
              popperClassName="custom-calendar-popper"
              required
            />
          </div>
        </div>

        <div className="form-group6 date-picker-wrapper">
          <label>Fecha Fin:</label>
          <div className="date-picker-container">
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Seleccionar fecha"
              className="date-input"
              calendarClassName="custom-calendar"
              popperClassName="custom-calendar-popper"
              required
            />
          </div>
        </div>

        {error && <div className="error-message6">{error}</div>}

        <div className="form-actions6">
          <button type="button" className="btn-cancel" onClick={handleCancel}>
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