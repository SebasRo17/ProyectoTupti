import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./MetodoPago.css";
import HeaderPagos from '../../Components/headerPago/headerPago.jsx';
import './responsiveMetodoPago.css';
import { getPedidoByCarrito, getDetallesPedido } from '../../Api/pedidoApi'; // ✅ Importar funciones

const MetodoPago = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [pedido, setPedido] = useState(null);
  const [detallesPedido, setDetallesPedido] = useState(null);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { idCarrito } = location.state || {};

  useEffect(() => {
    const obtenerPedido = async () => {
      if (idCarrito) {
        setIsLoading(true);
        try {
          const pedidoData = await getPedidoByCarrito(idCarrito);
          setPedido(pedidoData);

          // ✅ Obtener los detalles del pedido
          const detallesData = await getDetallesPedido(pedidoData.idPedido);
          setDetallesPedido(detallesData);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    obtenerPedido();
  }, [idCarrito]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/create-paypal-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total: detallesPedido.totales.total,
        }),
      });

      const order = await response.json();
      window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${order.id}`;
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pago');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Renderizado de los detalles del pedido
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
          <span></span>
        </div>

        {detallesPedido ? (
          <>
            <h3>Detalles del Pedido</h3>
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

            <h4>Totales</h4>
            <p><strong>Subtotal:</strong> ${detallesPedido.totales.subtotal.toFixed(2)}</p>
            <p><strong>Impuestos:</strong> ${detallesPedido.totales.impuestos.toFixed(2)}</p>
            <p><strong>Total:</strong> ${detallesPedido.totales.total.toFixed(2)}</p>
          </>
        ) : (
          <p>Cargando detalles del pedido...</p>
        )}

        <button
          type="button"
          className="boton-azul"
          onClick={handlePayment}
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : 'Ir a plataforma de pago'}
        </button>
      </div>
    </div>
  );
};

export default MetodoPago;
