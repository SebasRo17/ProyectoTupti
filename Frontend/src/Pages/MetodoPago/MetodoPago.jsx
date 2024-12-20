import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./MetodoPago.css";
import Footer from '../../Components/footer/footer.jsx';
import HeaderPagos from '../../Components/headerPago/headerPago.jsx';
import './responsiveMetodoPago.css';

const MetodoPago = () => {
  return (
    <div className="pagina-metodo-pago">
      {/* Contenedor del Header */}
      <div className="header-container">
        <HeaderPagos />
      </div>

      {/* Contenedor principal para el método de pago */}
      <div className="pago-container">
        <h2>Escoge tu medio de pago</h2>

        {/* Botón PayPal */}
        <div className="paypal">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
            alt="Logo de PayPal"
            className="paypal-logo"
          />
          <span></span>
        </div>


        {/* Información de Pago */}
        <div className="informacion-pago">
        
          {/* Tabla de información (Izquierda) */}
          <div className="informacion-tabla">
          <h3>Metodo de pago </h3>
          <div className="paypal-1">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
            
            className="paypal-logo1"
          />
          
           </div>
          
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

          {/* Formulario de información (Derecha) */}
          <div className="formulario-pago">
            <h3>Completa la información</h3>
            <form>
              <input type="text" placeholder="Nombre del titular" />
              <input type="text" placeholder="Tipo de identificación" />
              <input type="text" placeholder="Número de identificación" />
              <input type="text" placeholder="Número de teléfono" />
              <input type="email" placeholder="Correo electrónico" />
              <select>
                <option value="">Selecciona tu banco</option>
                <option value="banco1">Banco 1</option>
                <option value="banco2">Banco 2</option>
              </select>
              <label>
                <input type="checkbox" /> Acepto haber leído los{" "}
                <a href="#">términos y condiciones</a> y la{" "}
                <a href="#">política de privacidad</a>
              </label>
              <button className="boton-azul">Ir a plataforma de pago</button>
            </form>
          </div>
        </div>

        {/* Botón de Salida */}
        <Link to="/">
          <button className="boton-salir">SALIR</button>
        </Link>
      </div>
    </div>
  );
};

export default MetodoPago;
