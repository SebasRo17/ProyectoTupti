import React, { useState } from 'react';
import './nuevoProductoAdmin.css';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx';
import './responsivenuevoProdAdmin.css';

const NuevoProducto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    categoria: '',
    precioVenta: '',
    stock: '',
    cantidadStock: '',
    descripcion: '',
    id: '', 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
  };

  return (
    <div className="nuevo-producto-wrapper">
      <HeaderAdmin />
      <BarraLateralAdmin />
      <h2> NUEVO PRODUCTO </h2>
      <form onSubmit={handleSubmit}>
        <div className="imagenes-producto-container">
          <button type="button" className="image-selector-button">Escoger Imagen</button>
          <button type="button" className="image-selector-button">Escoger Imagen</button>
          <button type="button" className="image-selector-button">Escoger Imagen</button>
        </div>

        <div className="form-row-container">
          <div className="input-field-container">
            <label>Nombre del Producto</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-field-container">
            <label>Marca</label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row-container">
          <div className="input-field-container">
            <label>Categoría</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              <option value="Electrónico">Electrónico</option>
              <option value="Ropa">Ropa</option>
              {/* Agrega más opciones según sea necesario */}
            </select>
          </div>

          <div className="input-field-container">
            <label>Precio de Venta</label>
            <input
              type="number"
              name="precioVenta"
              value={formData.precioVenta}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row-container">
          <div className="input-field-container">
            <label>Stock en Estado</label>
            <select
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            >
              <option value="En-Stock">En Stock</option>
              <option value="Sin-Stock">Sin Stock</option>
            </select>
          </div>

          <div className="input-field-container">
            <label>Cantidad en Stock</label>
            <input
              type="number"
              name="cantidadStock"
              value={formData.cantidadStock}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row-container">
          <div className="input-field-container">
            <label>ID</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-field-container">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-action-buttons">
          <button type="button" className="save-draft-button">
            Guardar Borrador
          </button>
          <button type="submit" className="publish-product-button">
            Publicar Producto
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevoProducto;