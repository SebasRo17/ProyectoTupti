import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MetodoPago.css';
import './responsiveMetodoPago.css';
import HeaderPagos from '../../Components/headerPago/headerPago.jsx';
import { getPedidoByCarrito, getDetallesPedido } from '../../Api/pedidoApi';
import { createPaypalOrder, capturePaypalPayment } from '../../Api/pagosApi';

const MetodoPago = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [pedido, setPedido] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState(null);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  const location = useLocation();
  const { idCarrito } = location.state || {};

  useEffect(() => {
    const obtenerPedido = async () => {
      if (!idCarrito) {
        setError('No se proporcionó ID de carrito');
        return;
      }

      setIsLoading(true);
      try {
        const pedidoData = await getPedidoByCarrito(idCarrito);
        setPedido(pedidoData);
        const detallesData = await getDetallesPedido(pedidoData.idPedido);
        setDetallesPedido(detallesData);
      } catch (err) {
        setError('Error al cargar el pedido: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    obtenerPedido();
  }, [idCarrito]);

  const startPayPalFlow = async () => {
    if (!pedido || !detallesPedido) {
      alert('No hay información del pedido disponible');
      return;
    }

    try {
      setIsLoading(true);
      const montoFormateado = Number(detallesPedido.totales.total.toFixed(2));
      const { approveUrl, orderId } = await createPaypalOrder(
        pedido.idPedido,
        montoFormateado
      );

      // Configuración del popup
      const width = 450;
      const height = 600;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;

      const popupFeatures = `
        width=${width},
        height=${height},
        left=${left},
        top=${top},
        scrollbars=yes,
        status=yes,
        resizable=yes,
        location=yes
      `;

      const paypalPopup = window.open(approveUrl, 'PayPal', popupFeatures);

      if (!paypalPopup || paypalPopup.closed || typeof paypalPopup.closed === 'undefined') {
        alert('Por favor, habilita las ventanas emergentes para continuar con el pago');
        setIsLoading(false);
        return;
      }

      const checkPopupStatus = setInterval(() => {
        if (!paypalPopup || paypalPopup.closed) {
          clearInterval(checkPopupStatus);
          setIsLoading(false);
          return;
        }

        try {
          const popupUrl = paypalPopup.location.href;
          
          if (popupUrl.includes('/payment-success')) {
            paypalPopup.close();
            clearInterval(checkPopupStatus);
            console.log('Pago completado con éxito', orderId);
            capturePaypalPayment(orderId);
            setPaymentStatus('success');
            setIsLoading(false);
          } else if (popupUrl.includes('/payment-cancel')) {
            paypalPopup.close();
            clearInterval(checkPopupStatus);
            setPaymentStatus('cancelled');
            setIsLoading(false);
          }
        } catch (err) {
          // Manejar errores de cross-origin
          console.log('Esperando completar el pago...');
        }
      }, 1000);

    } catch (err) {
      console.error('Error al iniciar el pago:', err);
      setError('Error al iniciar el pago: ' + err.message);
      setIsLoading(false);
    }
  };

  const confirmarCompra = () => {
    setMostrarConfirmacion(false);
    startPayPalFlow();
  };

  const cerrarConfirmacion = () => {
    setMostrarConfirmacion(false);
  };

  // Renderizado condicional para estados de carga y error
  if (isLoading && !detallesPedido) {
    return (
      <div className="pagina-metodo-pago">
        <HeaderPagos />
        <div className="loading-message">Cargando información del pedido...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pagina-metodo-pago">
        <HeaderPagos />
        <div className="error-message">
          <p>{error}</p>
          <Link to="/">
            <button className="boton-salir">Volver al inicio</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-metodo-pago">
      <HeaderPagos />
      <div className="pago-container">
        <div className="paypal">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
            alt="Logo de PayPal"
            className="paypal-logo"
          />
        </div>

        <div className="informacion-pago">
          <h3>Método de pago</h3>
          {detallesPedido && (
            <>
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
                      <td>
                        {item.impuesto.nombre} ({item.impuesto.porcentaje}%)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="resumen-totales">
                <h4>Resumen del Pedido</h4>
                <div className="totales-grid">
                  <p>Cantidad total de items:</p>
                  <p>{detallesPedido.totales.cantidadItems}</p>
                  
                  <p>Subtotal:</p>
                  <p>${detallesPedido.totales.subtotal.toFixed(2)}</p>
                  
                  <p>Impuestos:</p>
                  <p>${detallesPedido.totales.impuestos.toFixed(2)}</p>
                  
                  <p><strong>Total Final:</strong></p>
                  <p><strong>${detallesPedido.totales.total.toFixed(2)}</strong></p>
                </div>
              </div>
            </>
          )}
        </div>

        {paymentStatus === 'success' && (
          <div className="success-message">
            ¡Pago procesado con éxito!
            <Link to="/">
              <button className="boton-continuar">Continuar</button>
            </Link>
          </div>
        )}

        <div className="botones-container">
          <Link to="/">
            <button className="boton-salir">SALIR</button>
          </Link>
          <button
            className="boton-azul"
            onClick={() => setMostrarConfirmacion(true)}
            disabled={isLoading || paymentStatus === 'success'}
          >
            {isLoading ? 'Procesando...' : 'Ir a plataforma de pago'}
          </button>
        </div>
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