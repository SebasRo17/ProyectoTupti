import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../Components/header/header';
import Footer from '../../Components/footer/footer';
import './direcciones.css';

const DireccionesGuardadas = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [direccionesGuardadas, setDireccionesGuardadas] = useState([]);

  useEffect(() => {
    // Sample data initialization
    const sampleData = [
      {
        nombre: "Casa",
        callePrincipal: "Av. 6 de Diciembre",
        numeracion: "N34-45",
        calleSecundaria: "El Inca",
        ciudad: "Quito",
        provincia: "Pichincha",
        barrio: "El Inca",
        pais: "Ecuador"
      },
      {
        nombre: "Trabajo",
        callePrincipal: "Av. Amazonas",
        numeracion: "N39-123",
        calleSecundaria: "Pereira",
        ciudad: "Quito",
        provincia: "Pichincha",
        barrio: "La Carolina",
        pais: "Ecuador"
      }
    ];
    setDireccionesGuardadas(sampleData);
    console.log("Direcciones cargadas:", sampleData);
  }, []);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="page-container" style={{ minHeight: '100vh' }}>
      <Header toggleCart={toggleCart} isCartOpen={isCartOpen} />
      <div className="direcciones-container" style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Direcciones Guardadas</h1>
        <div className="direcciones-list">
          {direccionesGuardadas.map((direccion, index) => (
            <div key={index} className="direccion-card" style={{ 
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              margin: '10px 0',
              backgroundColor: '#fff'
            }}>
              <h2>{direccion.nombre}</h2>
              <div className="direccion-detalles">
                <p><strong>Calle Principal:</strong> {direccion.callePrincipal}</p>
                <p><strong>Numeración:</strong> {direccion.numeracion}</p>
                <p><strong>Calle Secundaria:</strong> {direccion.calleSecundaria}</p>
                <p><strong>Barrio:</strong> {direccion.barrio}</p>
                <p><strong>Ciudad:</strong> {direccion.ciudad}</p>
                <p><strong>Provincia:</strong> {direccion.provincia}</p>
                <p><strong>País:</strong> {direccion.pais}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DireccionesGuardadas;