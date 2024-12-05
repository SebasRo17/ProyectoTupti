import React, { useState } from "react";
import "./CarritoCompras.css";

const CarritoCompras = () => {
  const [productos, setProductos] = useState([]);
  const [contador, setContador] = useState(0);

  // Ejemplo de productos disponibles (puedes reemplazar con datos reales o de una API)
  const productosDisponibles = [
    { id: 1, nombre: "Bebida A", precio: 10 },
    { id: 2, nombre: "Bebida B", precio: 15 },
    { id: 3, nombre: "Bebida C", precio: 20 },
  ];

  // Función para agregar un producto al carrito
  const agregarProducto = (producto) => {
    const existe = productos.find((p) => p.id === producto.id);
    if (existe) {
      setProductos(
        productos.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      setProductos([...productos, { ...producto, cantidad: 1 }]);
    }
    setContador(contador + 1);
  };

  // Función para actualizar la cantidad de un producto
  const actualizarCantidad = (id, cantidad) => {
    setProductos(
      productos.map((p) =>
        p.id === id ? { ...p, cantidad: Math.max(1, cantidad) } : p
      )
    );
    calcularContador();
  };

  // Función para eliminar un producto del carrito
  const eliminarProducto = (id) => {
    const producto = productos.find((p) => p.id === id);
    setProductos(productos.filter((p) => p.id !== id));
    setContador(contador - producto.cantidad);
  };

  // Función para recalcular el contador de productos
  const calcularContador = () => {
    const totalProductos = productos.reduce((total, p) => total + p.cantidad, 0);
    setContador(totalProductos);
  };

  // Calcular el total del carrito
  const totalCarrito = productos.reduce(
    (total, p) => total + p.precio * p.cantidad,
    0
  );

  return (
    <div className="carrito-container">
      <header>
        <h1>TUPTI</h1>
        <div className="carrito-icon">
          🛒 <span>{contador}</span>
        </div>
      </header>

      <div className="productos-disponibles">
        <h2>Productos Disponibles</h2>
        <div className="lista-productos">
          {productosDisponibles.map((producto) => (
            <div key={producto.id} className="producto">
              <p>{producto.nombre}</p>
              <p>${producto.precio}</p>
              <button onClick={() => agregarProducto(producto)}>Agregar</button>
            </div>
          ))}
        </div>
      </div>

      <div className="carrito">
        <h2>Carrito</h2>
        {productos.length === 0 ? (
          <p>El carrito está vacío</p>
        ) : (
          <div className="lista-carrito">
            {productos.map((producto) => (
              <div key={producto.id} className="producto-carrito">
                <p>{producto.nombre}</p>
                <p>${producto.precio}</p>
                <div className="cantidad-controles">
                  <button onClick={() => actualizarCantidad(producto.id, producto.cantidad - 1)}>-</button>
                  <span>{producto.cantidad}</span>
                  <button onClick={() => actualizarCantidad(producto.id, producto.cantidad + 1)}>+</button>
                </div>
                <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
              </div>
            ))}
            <div className="total">
              <p>Total: ${totalCarrito}</p>
            </div>
            <button className="comprar">Comprar Ahora</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarritoCompras;
