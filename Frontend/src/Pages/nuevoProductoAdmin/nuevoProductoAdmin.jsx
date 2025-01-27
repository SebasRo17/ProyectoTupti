import React, { useState, useEffect } from 'react';
import './nuevoProductoAdmin.css';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx';
import './responsivenuevoProdAdmin.css';
import { getAllTipoProductos, createProduct } from '../../api/productosApi';
import { getAllImpuestos } from '../../Api/ImpuestoApi.js';
import { createKardexProduct } from '../../Api/kardexApi';
import { productoImagenApi } from '../../Api/ProductoImagenApi.js';

const NuevoProducto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    precioVenta: '',
    cantidadStock: '',
    descripcion: '',
    idImpuesto: '', 
    imagenes: [''], // Array para almacenar URLs de imágenes, comenzando con un campo vacío
  });

  const [tipoProductos, setTipoProductos] = useState([]);
  const [impuestos, setImpuestos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTipoProductos = async () => {
      try {
        const data = await getAllTipoProductos();
        setTipoProductos(data);
      } catch (error) {
        console.error('Error fetching tipo productos:', error);
      }
    };

    const fetchImpuestos = async () => {
      try {
        const data = await getAllImpuestos();
        setImpuestos(data);
      } catch (error) {
        console.error('Error fetching impuestos:', error);
      }
    };

    fetchTipoProductos();
    fetchImpuestos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.imagenes];
    newImages[index] = value;
    if (index === formData.imagenes.length - 1 && value) {
      newImages.push(''); // Agregar un nuevo campo vacío si se ha llenado el último campo
    }
    setFormData((prevData) => ({
      ...prevData,
      imagenes: newImages,
    }));
  };

  const isFormValid = () => {
    return (
      formData.nombre &&
      formData.categoria &&
      formData.precioVenta &&
      formData.cantidadStock &&
      formData.descripcion &&
      formData.idImpuesto &&
      formData.imagenes.some((url) => url) // Al menos una imagen debe estar presente
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      Nombre: formData.nombre,
      IdTipoProducto: formData.categoria,
      Precio: formData.precioVenta,
      Stock: formData.cantidadStock,
      Descripcion: formData.descripcion,
      IdImpuesto: formData.idImpuesto,
    };

    try {
      const productResponse = await createProduct(productData);
      console.log('Producto creado:', productResponse);

      if (!productResponse || !productResponse.IdProducto) {
        console.error('Error: No se obtuvo un IdProducto válido del producto creado');
        console.log('Respuesta del servidor:', productResponse.IdProducto);
        return; // Detener la ejecución si no hay ID de producto
      }

      // Crear Kardex para el producto
      const kardexData = {
        idProducto: productResponse.IdProducto,  // cambiado a idProducto
        movimiento: 'Ingreso',
        cantidad: Number(formData.cantidadStock)
      };
      const kardexResponse = await createKardexProduct(kardexData);
      console.log('Kardex creado:', kardexResponse);

      // Crear imágenes del producto
      for (const imagenUrl of formData.imagenes) {
        if (imagenUrl) {
          const imagenData = {
            IdProducto: productResponse.IdProducto,
            ImagenUrl: imagenUrl,
          };
          await productoImagenApi.createProductoImagen(imagenData);
        }
      }

      // Redirigir a la página de productos después de crear el producto
      navigate('/ProductosAdmin');
    } catch (error) {
      console.error('Error al crear el producto, el Kardex o las imágenes:', error);
      // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className="nuevo-producto-wrapper">
      <HeaderAdmin />
      <BarraLateralAdmin />
      <h2> NUEVO PRODUCTO </h2>
      <form onSubmit={handleSubmit}>
        
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
              {tipoProductos.map((tipoProducto) => (
                <option key={tipoProducto.IdTipoProducto} value={tipoProducto.IdTipoProducto}>
                  {tipoProducto.detalle}
                </option>
              ))}
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
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row-container">
          <div className="input-field-container">
            <label>Impuesto</label>
            <select
              name="idImpuesto"
              value={formData.idImpuesto}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un impuesto</option>
              {impuestos.map((impuesto) => (
                <option key={impuesto.IdImpuesto} value={impuesto.IdImpuesto}>
                  {impuesto.Nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sección de agregar imágenes */}
        <div className="form-row-container">
          <div className="input-field-container">
            <h3>Agregar Imágenes</h3>
            {formData.imagenes.map((imagenUrl, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={imagenUrl}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder={`Ingresa el URL para cargar la imagen ${index + 1}`}
                />
                {imagenUrl && (
                  <div className="image-preview">
                    <img src={imagenUrl} alt={`Vista previa ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-action-buttons">
          <button type="submit" className="publish-product-button" disabled={!isFormValid()}>
            Publicar Producto
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevoProducto;