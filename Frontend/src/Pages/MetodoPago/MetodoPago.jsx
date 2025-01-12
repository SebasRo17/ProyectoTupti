import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./MetodoPago.css";
import HeaderPagos from '../../Components/headerPago/headerPago.jsx';
import './responsiveMetodoPago.css';
import { getPedidoByCarrito, getDetallesPedido } from '../../Api/pedidoApi';
import { openPaypalPopup, capturePaypalPayment } from '../../Api/pagosApi';

const MetodoPago = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [pedido, setPedido] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState(null);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const location = useLocation();
  const { idCarrito } = location.state || {};

  useEffect(() => {
    const obtenerPedido = async () => {
      if (idCarrito) {
        setIsLoading(true);
        try {
          const pedidoData = await getPedidoByCarrito(idCarrito);
          setPedido(pedidoData);
          const detallesData = await getDetallesPedido(pedidoData.idPedido);
          setDetallesPedido(detallesData);
        } catch (error) {
          setError('Error al cargar el pedido: ' + error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    obtenerPedido();

    const handleMessage = async (event) => {
      // Verificar origen del mensaje
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'PAYPAL_PAYMENT_SUCCESS') {
        const { orderId } = event.data;
        try {
          setIsLoading(true);
          await capturePaypalPayment(orderId);
          setPaymentStatus('success');
          // Redirigir a página de éxito
          window.location.href = '/pago-exitoso';
        } catch (err) {
          setError('Error al finalizar el pago: ' + err.message);
          setPaymentStatus('error');
        } finally {
          setIsLoading(false);
        }
      } else if (event.data.type === 'PAYPAL_PAYMENT_ERROR') {
        setError('El pago no pudo ser completado');
        setPaymentStatus('error');
      } else if (event.data.type === 'PAYPAL_PAYMENT_CANCELLED') {
        setError('El pago fue cancelado');
        setPaymentStatus('cancelled');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [idCarrito]);

  const handlePayment = async () => {
    if (!pedido || !detallesPedido) {
      setError('No hay información del pedido disponible');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const montoFormateado = Number(detallesPedido.totales.total.toFixed(2));
      const popup = await openPaypalPopup(pedido.idPedido, montoFormateado);
  
      if (!popup) {
        throw new Error('No se pudo abrir la ventana de PayPal');
      }
  
      // Revisar si la ventana se cierra
      const checkPopup = setInterval(async () => {
        if (popup.closed) {
          clearInterval(checkPopup);
          // Obtener el orderId guardado
          const orderId = localStorage.getItem('currentPaypalOrderId');
          // Obtener el estado del pago
          const paymentSuccess = localStorage.getItem('paypalPaymentSuccess');
  
          if (paymentSuccess === 'true' && orderId) {
            try {
              // Capturar el pago solo si fue exitoso
              await capturePaypalPayment(orderId);
              setPaymentStatus('success');
              // Limpiar localStorage
              localStorage.removeItem('currentPaypalOrderId');
              localStorage.removeItem('paypalPaymentSuccess');
              // Redireccionar
              window.location.href = '/pago-exitoso';
            } catch (err) {
              setError('Error al finalizar el pago: ' + err.message);
            }
          } else {
            setError('El pago no fue completado');
          }
          
          setIsLoading(false);
        }
      }, 500);
  
    } catch (error) {
      console.error('Error en el proceso de pago:', error);
      setError('Error al iniciar el pago: ' + error.message);
      setIsLoading(false);
    }
  };
  const confirmarCompra = () => {
    setMostrarConfirmacion(false);
    handlePayment();
  };

  const cerrarConfirmacion = () => {
    setMostrarConfirmacion(false);
  };

  if (error) {
    return (
      <div className="pagina-metodo-pago">
        <div className="header-container">
          <HeaderPagos />
        </div>
        <div className="error-container">
          <p>{error}</p>
          <button 
            className="boton-azul" 
            onClick={() => setError(null)}
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-metodo-pago">
      <div className="header-container">
        <HeaderPagos />
      </div>

      <div className="pago-container">
        <div className="paypal">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
            alt="Logo de PayPal"
            className="paypal-logo"
          />
        </div>

        <div className="informacion-pago">
          <div className="informacion-tabla">
            <h3>Método de pago</h3>
            <div className="paypal-1">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                className="paypal-logo1"
              />
            </div>
            <h4>Información de pago</h4>
            {detallesPedido ? (
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                    <th>Impuesto</th>
                  </tr>
                </thead>
                <tbody>
                  {detallesPedido.items.map((item) => (
                    <tr key={item.idCarritoDetalle}>
                      <td>{item.producto.nombre}</td>
                      <td>{item.producto.cantidad}</td>
                      <td>${item.producto.precioUnitario.toFixed(2)}</td>
                      <td>${item.producto.subtotal.toFixed(2)}</td>
                      <td>{item.impuesto.nombre} ({item.impuesto.porcentaje}%)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Cargando detalles del pedido...</p>
            )}
          </div>
        </div>

        {paymentStatus === 'success' && (
          <div className="success-message">
            ¡Pago procesado con éxito!
          </div>
        )}

        <Link to="/">
          <button className="boton-salir">SALIR</button>
        </Link>
        <button
          type="button"
          className="boton-azul"
          onClick={() => setMostrarConfirmacion(true)}
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : 'Ir a plataforma de pago'}
        </button>
      </div>
      
      {mostrarConfirmacion && (
        <div className="modal-confirmacion">
          <div className="modal-content">
            <h3>¿Estás seguro de querer realizar la compra?</h3>
            <div className="modal-buttons">
              <button onClick={confirmarCompra}>Sí</button>
              <button onClick={cerrarConfirmacion}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetodoPago;