import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Components/header/header';
import Footer from '../../Components/footer/footer';
import './facturas.css';
import { API_URL } from '../../config/config';
import { facturaApi } from '../../Api/facturaApi';
import jwt_decode from 'jwt-decode';

const Facturas = () => {
    const navigate = useNavigate();
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFacturas = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const decodedToken = jwt_decode(token);
                const userId = decodedToken.IdUsuario;

                if (!userId) {
                    throw new Error('No se pudo obtener el ID del usuario');
                }

                const data = await facturaApi.getFacturasByUsuario(userId);
                console.log('Datos recibidos:', data);
                setFacturas(data);
                setLoading(false);
            } catch (err) {
                console.error('Error en fetchFacturas:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFacturas();
    }, [navigate]);

    const handleDownloadPDF = async (pdfUrl) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`${API_URL}${pdfUrl}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Error al descargar el PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `factura.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
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