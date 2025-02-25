import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MetodoPago.css';

import HeaderPagos from '../../Components/headerPago/headerPago.jsx';
import { getPedidoByCarrito, getDetallesPedido } from '../../Api/pedidoApi';
import { createPaypalOrder, capturePaypalPayment } from '../../Api/pagosApi';
import jwtDecode from 'jwt-decode';
import { getSelectedAddress } from '../../Api/direccionApi';
import { enviarFacturaPorEmail } from '../../Api/facturaEmailApi';
import { generatePdfBlob } from '../../Components/PDFModelo/pdf.jsx';

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
  const [idUsuario, setIdUsuario] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [nombreCliente, setNombreCliente] = useState(''); // Estado para el nombre del cliente
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Estado para el popup de éxito

  const location = useLocation();
  const { idCarrito } = location.state || {};

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
        } catch (error) {
          console.error('Error al obtener la dirección:', error);
        }
      }
    };

    fetchSelectedAddress();
  }, [idUsuario]);

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
    const subtotal = detallesPedido.totales.subtotal;
    const serviceFee = subtotal * 0.08; // 8% del subtotal
    const totalWithFee = detallesPedido.totales.total + serviceFee;
    const montoFormateado = Number(totalWithFee.toFixed(2));

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
            handlePaymentSuccess(orderId);
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

  const handlePaymentSuccess = async (orderId) => {
    try {
        await capturePaypalPayment(orderId);
        
        if (pedido && pedido.idPedido) {
            setIsLoading(true);
            
            const clienteData = JSON.parse(localStorage.getItem('clienteData'));
            if (!clienteData) {
                throw new Error('Datos del cliente no encontrados');
            }

            // Calcular el total antes de generar el PDF
            const subtotal = detallesPedido.totales.subtotal || 0;
            const serviceFee = subtotal * 0.08;
            const totalConServicio = (detallesPedido.totales.total || 0) + serviceFee;
            const totalFacturaFinal = Number(totalConServicio.toFixed(2));

            console.log('Total calculado:', {
                subtotal,
                serviceFee,
                totalConServicio,
                totalFacturaFinal
            });

            const pdfBlob = await generatePdfBlob(idUsuario);
            
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const base64data = reader.result.split(',')[1];
                    
                    // Usar el total pre-calculado
                    await enviarFacturaPorEmail(
                        pedido.idPedido, 
                        base64data,
                        totalFacturaFinal // Usar el valor pre-calculado
                    );
                    
                    console.log('Factura enviada correctamente');
                    setPaymentStatus('success');
                    setShowSuccessPopup(true); // Mostrar popup de éxito
                } catch (error) {
                    console.error('Error detallado al enviar la factura:', error);
                    alert('Error al enviar la factura. Por favor, contacte al soporte.');
                }
            };
            reader.readAsDataURL(pdfBlob);
        }
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        alert('Error en el proceso de pago. Por favor, contacte al soporte.');
    } finally {
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

  const cerrarFormulario = () => {
    setMostrarConfirmacion(false);
  };

  const mostrarFormulario = () => {
    setMostrarConfirmacion(true);
  };

  const manejarEnvioFormulario = async (e) => {
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

    try {
      // Guardar datos del cliente en localStorage
      const clienteData = {
        nombre: esConsumidorFinal ? 'Consumidor Final' : nombreCliente,
        identificacion: esConsumidorFinal ? '9999999999999' : numeroIdentificacion
      };
      
      localStorage.setItem('clienteData', JSON.stringify(clienteData));
      console.log('Datos guardados:', clienteData); // Para verificar que se guardan
  
      // Cerrar el modal y comenzar el proceso de pago
      setMostrarConfirmacion(false);
      await startPayPalFlow();
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
      alert('Error al procesar el pago. Por favor, intente nuevamente.');
    }
  };

  const handleConsumidorFinalChange = (e) => {
    setEsConsumidorFinal(e.target.checked); // Actualiza el estado según el valor del checkbox
    if (e.target.checked) {
      setNumeroIdentificacion('9999999999999');
      setNombreCliente('Consumidor Final');
    } else {
      setNumeroIdentificacion('');
      setNombreCliente('');
    }
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

  const handleNombreClienteChange = (e) => {
    setNombreCliente(e.target.value);
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

   // Validación del formulario
   const esFormularioValido = 
   (esConsumidorFinal && aceptoTerminos) || 
   (!esConsumidorFinal && 
     nombreCliente && 
     numeroIdentificacion && 
     numeroTelefono && 
     aceptoTerminos);


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
                    <th>Descuento</th> 
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
                      <td>${item.producto.descuento.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="detalles-container">
                <div className="resumen-totales">
                  <h4>Resumen del Pedido</h4>
                  <div className="totales-grid">
                    <p>Cantidad total de items:</p>
                    <p>{detallesPedido.totales.cantidadItems}</p>

                    <p>Subtotal:</p>
                    <p>${detallesPedido.totales.subtotal.toFixed(2)}</p>

                    <p>Impuestos:</p>
                    <p>${detallesPedido.totales.impuestos.toFixed(2)}</p>

                    <p>Descuento Total:</p>
                    <p>${detallesPedido.totales.descuentos.toFixed(2)}</p>
                   
                    <p>Cuota de servicio (8%):</p>
                    <p>${(detallesPedido.totales.subtotal * 0.08).toFixed(2)}</p>

                    <p>
                      <strong>Total Final:</strong>
                    </p>
                    <p>
                      <strong>${(detallesPedido.totales.total + (detallesPedido.totales.subtotal * 0.08)).toFixed(2)}</strong>
                    </p>
                  </div>
                </div>

                {selectedAddress && (
                  <div className="resumen-direccion">
                    <h4>Dirección de Envío</h4>
                    <div className="direccion-grid">
                      <p><strong>Calle Principal:</strong></p>
                      <p>{selectedAddress.CallePrincipal} {selectedAddress.Numeracion}</p>

                      <p><strong>Calle Secundaria:</strong></p>
                      <p>{selectedAddress.CalleSecundaria}</p>

                      <p><strong>Referencia:</strong></p>
                      <p>{selectedAddress.Descripcion}</p>
                    </div>
                  </div>
                )}
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
        <div className="modal-overlay11">
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
                  value={nombreCliente}
                  onChange={handleNombreClienteChange}
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
  disabled={!esFormularioValido || isLoading}
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

      {showSuccessPopup && (
        <div className="modal-overlay11">
          <div className="modal-content11">
            <h3>¡Pago Exitoso!</h3>
            <div className="modal-body">
              <p>Su pago ha sido procesado correctamente.</p>
              <p>La factura ha sido enviada a su correo electrónico.</p>
              <div className="botones-container">
                <Link to="/">
                  <button className="boton-azul-pago">Volver al inicio</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetodoPago;
