import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./CarritoCompras.css";


const CarritoCompras = () => {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Producto 1", precio: 10.5, cantidad: 1 },
    { id: 2, nombre: "Producto 2", precio: 20.0, cantidad: 2 },
    { id: 3, nombre: "Producto 3", precio: 5.5, cantidad: 5 },
    { id: 4, nombre: "Producto 4", precio: 2.0, cantidad: 2 },

  ]);

  const eliminarProducto = (id) => {
    setProductos(productos.filter((producto) => producto.id !== id));
  };

  const actualizarCantidad = (id, cantidad) => {
    setProductos(
      productos.map((producto) =>
        producto.id === id
          ? { ...producto, cantidad: Math.max(1, producto.cantidad + cantidad) }
          : producto
      )
    );
  };

  const subtotal = productos.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );
  const comisionServicio = 0.08 * subtotal;
  const iva = 0.16 * subtotal;
  const ahorroTotal = 3.37; // Ejemplo de ahorro

  return (
    <div className="carrito-container">
      <header>
        <h1>Carrito de Compras</h1>
        <div className="carrito-icon">
          🛒
          <span>{productos.length}</span>
        </div>
      </header>

      {/* Lista de productos */}
      <div className="productos-lista">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <div key={producto.id} className="producto-item">
              <p>{producto.nombre}</p>
              <p>${producto.precio.toFixed(2)}</p>
              <div className="cantidad-controles">
                <button
                  onClick={() => actualizarCantidad(producto.id, -1)}
                  disabled={producto.cantidad <= 1}
                >
                  -
                </button>
                <span>{producto.cantidad}</span>
                <button onClick={() => actualizarCantidad(producto.id, 1)}>+</button>
                <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
              </div>
            </div>
          ))
        ) : (
          <p className="carrito-vacio">Tu carrito está vacío</p>
        )}
      </div>

      {/* Mostrar desglose solo si hay productos */}
      {productos.length > 0 && (
        <div className="resumen">
          <p>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </p>
          <p>
            <span>Comisión de servicio</span>
            <span>${comisionServicio.toFixed(2)}</span>
          </p>
          <p>
            <span>IVA</span>
            <span>${iva.toFixed(2)}</span>
          </p>
          <p className="ahorro">
            <span>Ahorro total</span>
            <span>-${ahorroTotal.toFixed(2)}</span>
          </p>
          <p className="total">
            <span>Total</span>
            <span>${(subtotal + comisionServicio + iva - ahorroTotal).toFixed(2)}</span>
          </p>
          <button className="boton-continuar">Continuar a información de entrega</button>
        </div>
      )}
    </div>
  );
};

export default CarritoCompras;
