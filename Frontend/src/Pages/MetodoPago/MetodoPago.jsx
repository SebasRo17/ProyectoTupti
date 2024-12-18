import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./MetodoPago.css";
import Footer from '../../Components/footer/footer.jsx';
import HeaderPagos from '../../Components/headerPago/headerPago.jsx';
/*import './responsiveMetodoPago.css';*/


const MetodoPago = () => {
  return (
    <div className="pagina-pago">
      {/* Header */}
      <HeaderPagos />

      {/* Contenedor Principal */}
      <div className="contenedor-pago">
        <div className="metodo-pago-titulo">
          <h2>Escoge tu medio de pago</h2>
        </div>

        {/* Sección de PayPal */}
        <div className="paypal-container">
          <img
            src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
            alt="PayPal"
            className="paypal-logo"
          />
        </div>

        {/* Formulario */}
        <div className="formulario-pago">
          <div className="metodo-pago">
            <h3>Medio de pago</h3>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="Logo PayPal"
              className="logo-metodo"
            />
          </div>

          <div className="informacion-pago">
            <h3>Información de pago</h3>
            <table>
              <tbody>
                <tr>
                  <td>Barbería y Estilismo 1</td>
                  <td>$1000</td>
                </tr>
                <tr>
                  <td>Barbería y Estilismo 2</td>
                  <td>$1000</td>
                </tr>
                <tr>
                  <td>Barbería y Estilismo 3</td>
                  <td>$1000</td>
                </tr>
                <tr>
                  <td>Subtotal</td>
                  <td>$3,000</td>
                </tr>
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td>
                    <strong>$3,000</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Campos del Formulario */}
          <div className="campos-formulario">
            <input type="text" placeholder="Nombre del titular" />
            <input type="text" placeholder="Tipo de identificación" />
            <input type="text" placeholder="Número de identificación" />
            <input type="text" placeholder="Número de teléfono" />
            <input type="email" placeholder="Correo electrónico" />
            <select>
              <option>Selecciona tu banco</option>
              <option>Banco 1</option>
              <option>Banco 2</option>
            </select>
          </div>

          {/* Términos y Botón */}
          <div className="aceptar-terminos">
            <input type="checkbox" id="terminos" />
            <label htmlFor="terminos">
              Acepto haber leído los{" "}
              <a href="/">términos y condiciones y políticas de privacidad</a>
            </label>
          </div>
          <div className="boton-pagar">
            <button>Ir a plataforma de pago</button>
          </div>
          <div className="boton-salir">
            <button>SALIR</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MetodoPago;
