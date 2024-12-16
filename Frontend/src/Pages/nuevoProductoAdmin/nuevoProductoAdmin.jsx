import React, { useState } from 'react';
import './nuevoProductoAdmin.css';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx';




const NuevoProducto = () => {
  const [nombreProducto, setNombreProducto] = useState('');
  const [marca, setMarca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precioRegular, setPrecioRegular] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [cronograma, setCronograma] = useState('');
  const [stockEstado, setStockEstado] = useState('');
  const [sku, setSku] = useState('');
  const [cantidadEnStock, setCantidadEnStock] = useState('');
  const [unidad, setUnidad] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío de los datos del producto
    console.log('Producto publicado');
  };

  return (
    <div className="nuevo-producto-container">
      <h2>Nuevo Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="imagenes-producto">
          <button className="image-button">Escoger Imagen</button>
          <button className="image-button">Escoger Imagen</button>
          <button className="image-button">Escoger Imagen</button>
        </div>

        <div className="form-group">
          <label>Nombre del Producto</label>
          <input
            type="text"
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
            placeholder="Ej. Sport Smart Watch"
          />
        </div>

        <div className="form-group">
          <label>Marca</label>
          <input
            type="text"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Categoría</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Precio Regular</label>
          <input
            type="number"
            value={precioRegular}
            onChange={(e) => setPrecioRegular(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Precio de Venta</label>
          <input
            type="number"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Cronograma</label>
          <input
            type="date"
            value={cronograma}
            onChange={(e) => setCronograma(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Stock en Estado</label>
          <select
            value={stockEstado}
            onChange={(e) => setStockEstado(e.target.value)}
          >
            <option value="En Stock">En Stock</option>
            <option value="Agotado">Agotado</option>
          </select>
        </div>

        <div className="form-group">
          <label>SKU</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Cantidad en Stock</label>
          <input
            type="number"
            value={cantidadEnStock}
            onChange={(e) => setCantidadEnStock(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Unidad</label>
          <input
            type="text"
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción del producto..."
          />
        </div>

        <div className="form-buttons">
          <button className="guardar-borrador">Guardar Borrador</button>
          <button type="submit" className="publicar-producto">Publicar Producto</button>
        </div>
      </form>
    </div>
  );
};

export default NuevoProducto;
