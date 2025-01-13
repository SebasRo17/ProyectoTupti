import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../Components/header/header';
import Footer from '../../Components/footer/footer';
import './facturas.css';

const Facturas = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    // Datos de ejemplo de facturas
    const [facturas] = useState([
        { id: 1, fecha: '2024-03-01', numero: 'F-001', monto: 150.00 },
        { id: 2, fecha: '2024-03-05', numero: 'F-002', monto: 275.50 },
        { id: 3, fecha: '2024-03-10', numero: 'F-003', monto: 420.75 },
    ]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

  return (
    <div className="app-wrapper">
      <Header />
      <main className="main-content">
        <div className="facturas-container">
          <section className="facturas-section">
            <h2>Listado de Pedidos</h2>
            <p className="fecha-actual">
                Fecha y hora de autorización: {currentDateTime.toLocaleString('es-ES')}
            </p>
            
            <div className="table-container">
              <table className="facturas-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Número de Factura</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {facturas.map(factura => (
                    <tr key={factura.id}>
                      <td>{new Date(factura.fecha).toLocaleDateString()}</td>
                      <td>{factura.numero}</td>
                      <td>${factura.monto.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Facturas;