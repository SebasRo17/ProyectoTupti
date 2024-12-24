import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../Components/header/header';
import Footer from '../../Components/footer/footer';
import './facturas.css';

const Facturas = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };
  // Sample invoice data - replace with actual data
  const facturas = [
    { id: 1, fecha: '2024-03-01', numero: 'F-001', monto: 150.00 },
    { id: 2, fecha: '2024-03-05', numero: 'F-002', monto: 275.50 },
    { id: 3, fecha: '2024-03-10', numero: 'F-003', monto: 420.75 },
  ];

  return (
    <div className="app-wrapper">
      <Header />
      
      <main className="main-content">
        <div className="facturas-container">
          <section className="facturas-section">
            <h2>Listado de Facturas</h2>
            
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