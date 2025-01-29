import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Components/header/header';
import Footer from '../../Components/footer/footer';
import './facturas.css';
import { API_URL } from '../../config/config';

const Facturas = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFacturas = async () => {
            try {
                // Obtener el ID del usuario del localStorage o donde lo tengas almacenado
                const userId = localStorage.getItem('userId');
                const response = await fetch(`http://localhost:3000/factura/usuario/${userId}`, {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error('Error al cargar las facturas');
                }
                
                const data = await response.json();
                setFacturas(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFacturas();
    }, []);

    const handleDownloadPDF = async (pdfUrl) => {
        try {
            window.open(`${API_URL}${pdfUrl}`, '_blank');
        } catch (error) {
            console.error('Error al descargar el PDF:', error);
        }
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    return (
        <div className="app-wrapper">
            <Header toggleCart={toggleCart} isCartOpen={isCartOpen} />
            <main className="main-content">
                <div className="facturas-container">
                    <section className="facturas-section">
                        <h2>Listado de Facturas</h2>
                        <p className="fecha-actual">
                            Fecha y hora actual: {currentDateTime.toLocaleString('es-ES')}
                        </p>
                        
                        {loading ? (
                            <p>Cargando facturas...</p>
                        ) : error ? (
                            <p className="error-message">{error}</p>
                        ) : (
                            <div className="table-container">
                                <table className="facturas-table">
                                    <thead>
                                        <tr>
                                            <th>ID Pedido</th>
                                            <th>Fecha</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {facturas.map((factura) => (
                                            <tr key={factura.idPedido}>
                                                <td>{factura.idPedido}</td>
                                                <td>{new Date(factura.fechaCreacion).toLocaleDateString('es-ES')}</td>
                                                <td>
                                                    <button 
                                                        className="download-btn"
                                                        onClick={() => handleDownloadPDF(factura.pdfUrl)}
                                                    >
                                                        Descargar PDF
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Facturas;