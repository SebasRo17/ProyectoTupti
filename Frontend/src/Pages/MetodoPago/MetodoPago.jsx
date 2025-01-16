import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MetodoPago.css';

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
  const [esConsumidorFinal, setEsConsumidorFinal] = useState(false); // Estado para consumidor final
  const [tipoDocumento, setTipoDocumento] = useState('cedula'); // Estado para el tipo de documento
  const [numeroIdentificacion, setNumeroIdentificacion] = useState(''); // Estado para el número de identificación
  const [numeroTelefono, setNumeroTelefono] = useState(''); // Estado para el número de teléfono
  const [aceptoTerminos, setAceptoTerminos] = useState(false); // Estado para aceptar términos

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

  const confirmarCompra = () => {
    setMostrarConfirmacion(false);
    startPayPalFlow();
  };

  const cerrarFormulario = () => {
    setMostrarConfirmacion(false);
  };

  const mostrarFormulario = () => {
    setMostrarConfirmacion(true);
  };

  const manejarEnvioFormulario = (e) => {
    e.preventDefault();
    
    // Validar el número de identificación
    if (!esConsumidorFinal) {
      if (tipoDocumento === 'cedula' && numeroIdentificacion.length !== 10) {
        alert('La cédula debe tener 10 dígitos');
        return;
      }

      if (tipoDocumento === 'ruc' && numeroIdentificacion.length !== 13) {
        alert('El RUC debe tener 13 dígitos');
        return;
      }
    }
    
    console.log('Formulario enviado');
    setMostrarConfirmacion(false);
  };

  const handleConsumidorFinalChange = (e) => {
    setEsConsumidorFinal(e.target.checked); // Actualiza el estado según el valor del checkbox
  };

  const handleTipoDocumentoChange = (e) => {
    setTipoDocumento(e.target.value); // Actualiza el tipo de documento seleccionado
  };

  const handleNumeroIdentificacionChange = (e) => {
    const value = e.target.value;
    // Solo permite números
    if (/^\d*$/.test(value)) {
      setNumeroIdentificacion(value);
    }
  };

  const handleTelefonoChange = (e) => {
    const value = e.target.value;
    // Solo permite números
    if (/^\d*$/.test(value)) {
      setNumeroTelefono(value);
    }
  };

  const handleTerminosChange = (e) => {
    setAceptoTerminos(e.target.checked); // Actualiza el estado cuando cambia el checkbox de términos
  };

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

                  <p>
                    <strong>Total Final:</strong>
                  </p>
                  <p>
                    <strong>${detallesPedido.totales.total.toFixed(2)}</strong>
                  </p>
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
            className="boton-azul-pago"
            onClick={mostrarFormulario}
            disabled={isLoading}
          >
            PAGAR
          </button>
        </div>
      </div>

      {mostrarConfirmacion && (
        <div className="modal-overlay10">
          <div className="modal-content11">
            <h3>COMPLETA LA INFORMACIÓN</h3>
            <div className="modal-body">
              <form onSubmit={manejarEnvioFormulario}>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="checkbox-consufinal"
                    checked={esConsumidorFinal}
                    onChange={handleConsumidorFinalChange}
                  />
                  <label htmlFor="checkbox-consufinal">Consumidor final</label>
                </div>

                <input
                  type="text"
                  placeholder="Nombre del titular"
                  required={!esConsumidorFinal}
                  disabled={esConsumidorFinal}
                />

                <select
                  value={tipoDocumento}
                  onChange={handleTipoDocumentoChange}
                  disabled={esConsumidorFinal}
                  required={!esConsumidorFinal}
                >
                  <option value="cedula">Cédula</option>
                  <option value="ruc">RUC</option>
                </select>

                <input
                  type="text"
                  placeholder="Número de identificación"
                  required={!esConsumidorFinal}
                  disabled={esConsumidorFinal}
                  value={numeroIdentificacion}
                  onChange={handleNumeroIdentificacionChange}
                />

                <input
                  type="text"
                  placeholder="Número de teléfono"
                  required={!esConsumidorFinal}
                  disabled={esConsumidorFinal}
                  value={numeroTelefono}
                  onChange={handleTelefonoChange} // Este maneja solo números
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  required={!esConsumidorFinal}
                  disabled={esConsumidorFinal}
                />

                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="terminos"
                    checked={aceptoTerminos}
                    onChange={handleTerminosChange}
                    required={!esConsumidorFinal} // Esto se ajusta según el caso
                  />
                  <label htmlFor="terminos">
                    Acepto haber leído los <a href="#">términos y condiciones</a> y
                    la <a href="#">política de privacidad</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="boton-confirmacion"
                  disabled={isLoading || !aceptoTerminos} // Deshabilitado si no se marcan los términos
                >
                  {isLoading ? 'Procesando...' : 'Ir a la plataforma de pago'}
                </button>
              </form>
              <button className="boton-salir" onClick={cerrarFormulario}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetodoPago;
