import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import "./CarritoCompras.css";
import "./responsiveCarrito.css";
import { 
  getCarritoByUsuario, addToCart, getTotalesCarrito, actualizarEstadoCarrito, deleteCarritoDetalle } from '../../Api/carritoApi.js';
import { getDescuentoCarrito } from '../../Api/descuentosApi.js';
import { createPedido, getPedidoByCarrito } from '../../Api/pedidoApi.js';
import { getSelectedAddress } from '../../Api/direccionApi.js';
import { createKardexProduct, validateStock} from '../../Api/kardexApi.js';
import { useCart } from '../../Context/CartContext.jsx';

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
  const [showAddressWarning, setShowAddressWarning] = useState(false);
  const [addressError, setAddressError] = useState(null);
  const [mostrarPopUpVaciar, setMostrarPopUpVaciar] = useState(false);
  const [showStockError, setShowStockError] = useState(false);
  const [stockErrorMessage, setStockErrorMessage] = useState('');
  const { updateCartCount } = useCart();

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
        try {
          const address = await getSelectedAddress(idUsuario);
          setSelectedAddress(address);
          setAddressError(null);
        } catch (error) {
          setAddressError('No hay una dirección seleccionada. Por favor, seleccione una dirección de envío.');
          setSelectedAddress(null);
          setShowAddressWarning(true);
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
            idCarritoDetalle: detalle.IdCarritoDetalle,
            nombre: detalle.Producto.Nombre,
            precio: parseFloat(detalle.PrecioUnitario),
            precioOriginal: parseFloat(detalle.Producto.PrecioOriginal),
            precioConDescuento: detalle.Producto.PrecioConDescuento,
            porcentajeDescuento: detalle.Producto.PorcentajeDescuento || 0,
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

  // Update fetchDescuentos useEffect
useEffect(() => {
  const fetchDescuentos = async () => {
    if (idCarrito && productos.length > 0) {
      try {
        const descuentosData = await getDescuentoCarrito(idCarrito);
        if (descuentosData) {
          setDescuentos(descuentosData);
        }
      } catch (error) {
        console.error('Error al obtener descuentos:', error);
        setDescuentos({ descuentoTotal: 0, detallesConDescuento: [] });
      }
    } else {
      // Reset descuentos when cart is empty
      setDescuentos({ descuentoTotal: 0, detallesConDescuento: [] });
    }
  };

  fetchDescuentos();
}, [idCarrito, productos]); 

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
        const kardexData = {
          idProducto: productoAEliminar.id,
          movimiento: 'Ingreso',
          cantidad: productoAEliminar.cantidad // Positive for ingreso
        };

        await handleAgregarCarrito(productoAEliminar.id, -productoAEliminar.cantidad);
        await createKardexProduct(kardexData);
        await deleteCarritoDetalle(productoAEliminar.idCarritoDetalle);
        
        updateCartCount(); 
        setProductos(productos.filter((p) => p.id !== productoAEliminar.id));
        setMostrarPopUp(false);
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('No se pudo eliminar el producto del carrito');
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
      if (producto.cantidad < 1) return;
  
      // Only validate stock when increasing quantity
      if (cambio > 0) {
        const stockValidation = await validateStock(id, 1);
        
        if (!stockValidation.disponible) {
          setShowStockError(true);
          setStockErrorMessage(stockValidation.error);
          setTimeout(() => {
            setShowStockError(false);
            setStockErrorMessage('');
          }, 3000);
          return;
        }
      }
  
      const kardexData = {
        idProducto: id,
        movimiento: cambio > 0 ? 'Venta' : 'Ingreso',
        cantidad: cambio > 0 ? -1 : 1
      };
  
      await handleAgregarCarrito(id, cambio);
      await createKardexProduct(kardexData);
  
      setProductos(
        productos.map((producto) =>
          producto.id === id
            ? { ...producto, cantidad: Math.max(1, producto.cantidad + cambio) }
            : producto
        )
      );
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      setShowStockError(true);
      setStockErrorMessage('Error al actualizar la cantidad');
      setTimeout(() => {
        setShowStockError(false);
        setStockErrorMessage('');
      }, 3000);
    }
  };

  
  const handlePagar = async (e) => {
    e.preventDefault();
    
    if (!selectedAddress) {
      setShowAddressWarning(true);
      setAddressError('Por favor, seleccione una dirección de envío antes de continuar');
      return;
    }
    setShowAddressWarning(false);
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
  const mostrarConfirmacionVaciar = () => {
    setMostrarPopUpVaciar(true);
  };
  const cancelarVaciado = () => {
    setMostrarPopUpVaciar(false);
  };
  const confirmarAbandonarCarrito = () => {
    abandonarCarrito();
    setMostrarPopUpVaciar(false);
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
                {producto.porcentajeDescuento > 0 && (
                  <div className="descuento-badge">
                    -{producto.porcentajeDescuento}%
                  </div>
                )}
                <div className="producto-imagen">
                  <img src={producto.imagen} alt={producto.nombre} />
                </div>
                <div className="producto-info">
                  <p><strong>{producto.nombre}</strong></p>
                  <p>${(producto.precio * producto.cantidad).toFixed(2)}</p>
                  <p>${producto.precio.toFixed(2)} x {producto.cantidad}</p>
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
        {showAddressWarning && (
          <div className="address-warning">
            <span className="warning-icon">⚠️</span>
            <p>{addressError}</p>
          </div>
        )}
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
            <button onClick={mostrarConfirmacionVaciar}  className="boton-vaciar">
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
        {mostrarPopUpVaciar && (
        <div className="popup">
          <div className="popup-contenido">
            <p>¿Estás seguro que deseas vaciar el carrito?</p>
            <button className="btn-sí" onClick={confirmarAbandonarCarrito}>Sí</button>
            <button className="btn-no" onClick={cancelarVaciado}>No</button>
          </div>
        </div>
      )}

        {!idUsuario && (
          <p className="mensaje-sesion">Debes iniciar sesión para realizar compras.</p>
        )}
      </div>
      {showStockError && (
          <div className="alert-message error">
            {stockErrorMessage}
          </div>
        )}
    </div>
  );
};

export default CarritoCompras;