import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa'; // Importar el ícono de la basura
import "./CarritoCompras.css";
import "./responsiveCarrito.css";
import { getCarritoByUsuario, addToCart } from '../../Api/carritoApi.js';
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom';
import { getDescuentoCarrito } from '../../Api/descuentosApi.js';


const CarritoCompras = () => {
  const [productos, setProductos] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null); 
  const [idCarrito, setIdCarrito] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [productoAEliminar, setProductoAEliminar] = useState(null); 
  const [mostrarPopUp, setMostrarPopUp] = useState(false); 
  const [descuentos, setDescuentos] = useState({ descuentoTotal: 0, detallesConDescuento: [] });

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const payload = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        setIdUsuario(payload.IdUsuario); 
  
        if (payload.exp <= currentTime) {
          localStorage.removeItem('jwtToken');
        }
      } catch (error) {
        localStorage.removeItem('jwtToken');
      }
    }
  }, []);

  useEffect(() => {
    const fetchCarrito = async () => {
      if (idUsuario) {
        setIsLoading(true);
        try {
          const carritoData = await getCarritoByUsuario(idUsuario);
          setProductos(carritoData.detalles.map(detalle => ({
            id: detalle.IdProducto,
            nombre: detalle.Producto.Nombre,
            precio: parseFloat(detalle.PrecioUnitario),
            cantidad: detalle.Cantidad,
            imagen: detalle.Producto.ImagenUrl
          })));
          setIdCarrito(carritoData.carrito.IdCarrito);
        } catch (error) {
          // Manejar error
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCarrito();
  }, [idUsuario]);

  useEffect(() => {
    const fetchDescuentos = async () => {
      if (idCarrito) {
        try {
          const descuentosData = await getDescuentoCarrito(idCarrito);
          if (descuentosData) {
            setDescuentos(descuentosData);
          }
        } catch (error) {
          console.error('Error al obtener descuentos:', error);
          setDescuentos({ descuentoTotal: 0, detallesConDescuento: [] });
        }
      }
    };
  
    fetchDescuentos();
  }, [idCarrito]);

  const handleAgregarCarrito = async (idProducto, cantidad) => {
    try {
      const productData = {
        idUsuario: idUsuario,
        idProducto: idProducto,
        cantidad: cantidad
      };

      await addToCart(productData);
    } catch (error) {
      // Manejar error
    }
  };

  const eliminarProducto = async () => {
    if (productoAEliminar) {
      try {
        await handleAgregarCarrito(productoAEliminar.id, -productoAEliminar.cantidad);
        setProductos(productos.filter((p) => p.id !== productoAEliminar.id));
        setMostrarPopUp(false);
      } catch (error) {
        // Manejar error
      }
    }
  };

  const mostrarConfirmacionEliminar = (producto) => {
    setProductoAEliminar(producto); 
    setMostrarPopUp(true); 
  };

  const cancelarEliminacion = () => {
    setMostrarPopUp(false); 
  };

  const actualizarCantidad = async (id, cambio) => {
    try {
      const producto = productos.find(p => p.id === id);
      if (producto.cantidad + cambio < 1) return;

      await handleAgregarCarrito(id, cambio);

      setProductos(
        productos.map((producto) =>
          producto.id === id
            ? { ...producto, cantidad: Math.max(1, producto.cantidad + cambio) }
            : producto
        )
      );
    } catch (error) {
      // Manejar error
    }
  };

  const vaciarCarrito = async () => {
    try {
      // Eliminar todos los productos
      for (const producto of productos) {
        await handleAgregarCarrito(producto.id, -producto.cantidad); 
      }
      setProductos([]); // Vaciar la lista de productos en el estado
    } catch (error) {
      // Manejar error
    }
  };

  const subtotal = productos.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );
  const comisionServicio = 0.08 * subtotal;
  const iva = 0.15 * subtotal;
  const ahorroTotal = descuentos.descuentoTotal || 0;
  const total = subtotal + comisionServicio + iva - ahorroTotal;

  return (
    <div className="mi-carrito">
      <div className="carrito-container">
        <header>
          <h1>Carrito de Compras</h1>
          <div className="carrito-icon">
            🛒
            <span>{productos.length}</span>
          </div>
        </header>

        <div className="productos-lista">
          {isLoading ? (
            <p>Cargando productos...</p>
          ) : productos.length > 0 ? (
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
                  <button onClick={() => actualizarCantidad(producto.id, -1)} disabled={producto.cantidad <= 1}>-</button>
                  <span>{producto.cantidad}</span>
                  <button onClick={() => actualizarCantidad(producto.id, 1)}>+</button>
                  <button onClick={() => mostrarConfirmacionEliminar(producto)} className="eliminar">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="carrito-vacio">Tu carrito está vacío</p>
          )}
        </div>

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
              <span>${total.toFixed(2)}</span>
            </p>
            <Link to={`/MetodoPago`} state={{ idCarrito: idCarrito }}>
              <button className="boton-continuar" disabled={!idCarrito}>
                PAGAR
              </button>
            </Link>

            {/* Botón Vaciar Carrito */}
            <button onClick={vaciarCarrito} className="boton-vaciar">
              VACIAR CARRITO
            </button>
          </div>
        )}

        {mostrarPopUp && (
          <div className="popup">
            <div className="popup-contenido">
              <p>¿Deseas eliminar este producto?</p>
              <button className="btn-sí" onClick={eliminarProducto}>Sí</button>
              <button className="btn-no" onClick={cancelarEliminacion}>No</button>
            </div>
          </div>
        )}

        {!idUsuario && (
          <p className="mensaje-sesion">Debes iniciar sesión para realizar compras.</p>
        )}
      </div>
    </div>
  );
};

export default CarritoCompras;
