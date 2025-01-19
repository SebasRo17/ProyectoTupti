import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import "./CarritoCompras.css";
import "./responsiveCarrito.css";
import { 
  getCarritoByUsuario, addToCart, getTotalesCarrito, actualizarEstadoCarrito } from '../../Api/carritoApi.js';
import { getDescuentoCarrito } from '../../Api/descuentosApi.js';
import { createPedido, getPedidoByCarrito } from '../../Api/pedidoApi.js';
import { getSelectedAddress } from '../../Api/direccionApi.js';

const CarritoCompras = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null);
  const [idCarrito, setIdCarrito] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [mostrarPopUp, setMostrarPopUp] = useState(false);
  const [descuentos, setDescuentos] = useState({ descuentoTotal: 0, detallesConDescuento: [] });
  const [totalesCarrito, setTotalesCarrito] = useState({ impuestoTotal: 0 });
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

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
    const fetchSelectedAddress = async () => {
      if (idUsuario) {
        setIsLoading(true);
        try {
          const address = await getSelectedAddress(idUsuario);
          setSelectedAddress(address);
        } catch (error) {
          console.error('Error al obtener la dirección seleccionada:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSelectedAddress();
  }, [idUsuario]);

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
          console.error('Error al obtener el carrito:', error);
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

  useEffect(() => {
    const fetchTotales = async () => {
      if (idCarrito) {
        try {
          const totales = await getTotalesCarrito(idCarrito);
          setTotalesCarrito(totales);
        } catch (error) {
          console.error('Error al obtener totales:', error);
        }
      }
    };

    fetchTotales();
  }, [idCarrito, productos]);

  const handleAgregarCarrito = async (idProducto, cantidad) => {
    try {
      const productData = {
        idUsuario: idUsuario,
        idProducto: idProducto,
        cantidad: cantidad
      };

      await addToCart(productData);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

  const eliminarProducto = async () => {
    if (productoAEliminar) {
      try {
        await handleAgregarCarrito(productoAEliminar.id, -productoAEliminar.cantidad);
        setProductos(productos.filter((p) => p.id !== productoAEliminar.id));
        setMostrarPopUp(false);
      } catch (error) {
        console.error('Error al eliminar producto:', error);
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
      console.error('Error al actualizar cantidad:', error);
    }
  };

  
  const handlePagar = async (e) => {
    e.preventDefault();
    
    if (!idCarrito || !selectedAddress) {
      alert('No se puede procesar el pedido sin una dirección de envío');
      return;
    }

    setIsCreatingOrder(true);
    try {
      let pedidoCreado;
      try {
        const pedidoExistente = await getPedidoByCarrito(idCarrito);
        if (pedidoExistente) {
          pedidoCreado = pedidoExistente;
        }
      } catch (error) {
        console.log('No se encontró un pedido existente, creando uno nuevo...');
      }

      if (!pedidoCreado) {
        const orderData = {
          IdUsuario: idUsuario,
          Direccion_IdDireccion: selectedAddress.IdDireccion,
          Estado: 0,
          IdCarrito: idCarrito
        };

        console.log("Datos del pedido a enviar:", orderData); // Agregamos este log
        pedidoCreado = await createPedido(orderData);
      }

      navigate('/MetodoPago', { 
        state: { 
          idCarrito: idCarrito,
          idPedido: pedidoCreado.IdPedido
        } 
      });
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      alert('No se pudo procesar el pedido. Por favor, intente nuevamente.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const abandonarCarrito = async () => {
    try {
      if (!idCarrito) return;
      
      await actualizarEstadoCarrito(idCarrito, "ABANDONADO");
      setProductos([]);
      setIdCarrito(null);
    } catch (error) {
      console.error('Error al abandonar el carrito:', error);
      alert('No se pudo vaciar el carrito. Por favor, intente nuevamente.');
    }
  };

  const subtotal = productos.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );
  const comisionServicio = 0.08 * subtotal;
  const iva = totalesCarrito.impuestoTotal;
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
                  <button 
                    onClick={() => actualizarCantidad(producto.id, -1)} 
                    disabled={producto.cantidad <= 1}
                  >
                    -
                  </button>
                  <span>{producto.cantidad}</span>
                  <button onClick={() => actualizarCantidad(producto.id, 1)}>+</button>
                  <button 
                    onClick={() => mostrarConfirmacionEliminar(producto)} 
                    className="eliminar"
                  >
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
              <span>IVA</span>
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
            <button 
              className="boton-continuar" 
              disabled={!idCarrito || isCreatingOrder || !selectedAddress}
              onClick={handlePagar}
            >
              {isCreatingOrder ? 'PROCESANDO...' : 'PAGAR'}
            </button>
            <button onClick={abandonarCarrito} className="boton-vaciar">
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