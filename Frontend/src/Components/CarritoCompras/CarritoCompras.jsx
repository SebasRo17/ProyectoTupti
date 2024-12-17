import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./CarritoCompras.css";
import { FaTrash } from 'react-icons/fa'; // Importar el ícono de la basura
import "./responsiveCarrito.css";


const CarritoCompras = ({ productos, eliminarProducto, actualizarCantidad }) => {
  const subtotal = productos.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );
  const comisionServicio = 0.08 * subtotal;
  const iva = 0.15 * subtotal;
  const ahorroTotal = 3.37; // Ejemplo de ahorro

  return (
    <div className="mi-carrito">
      <div className="carrito-container">
        <header>
          <h1>Carrito de Compras</h1>
          <div className="carrito-icon">
            🛒
            <span>{productos.length}</span> {/* Contador de productos */}
          </div>
        </header>

        {/* Lista de productos */}
        <div className="productos-lista">
          {productos.length > 0 ? (
            productos.map((producto) => (
              <div key={producto.id} className="producto-item">
                <div className="producto-imagen">
                  <img src={producto.imagen} alt={producto.nombre} />
                </div>
                <div className="producto-info">
                  <p><strong>{producto.nombre}</strong></p>
                  <p>${(producto.precio * producto.cantidad).toFixed(2)}</p>
                  <p>{producto.precio.toFixed(2)} x {producto.cantidad}</p>
                </div>
                <div className="cantidad-controles">
                  {/* Botón para disminuir la cantidad */}
                  <button
                    onClick={() => actualizarCantidad(producto.id, -1)}
                    disabled={producto.cantidad <= 1} // Deshabilitado si la cantidad es 1
                  >
                    -
                  </button>
                  <span>{producto.cantidad}</span>
                  {/* Botón para aumentar la cantidad */}
                  <button onClick={() => actualizarCantidad(producto.id, 1)}>
                    +
                  </button>
                  {/* Botón para eliminar el producto */}
                  <button
                    onClick={() => eliminarProducto(producto.id)}
                    className="eliminar"
                  >
                    <FaTrash /> {/* Ícono de la basura */}
                  </button>
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
              <span>IVA 15%</span>
              <span>${iva.toFixed(2)}</span>
            </p>
            <p className="ahorro">
              <span>Ahorro total</span>
              <span>-${ahorroTotal.toFixed(2)}</span>
            </p>
            <p className="total">
              <span>Total</span>
              <span>
                ${(
                  subtotal +
                  comisionServicio +
                  iva - 
                  ahorroTotal
                ).toFixed(2)}
              </span>
            </p>
            <button className="boton-continuar">
              PAGAR
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarritoCompras;
