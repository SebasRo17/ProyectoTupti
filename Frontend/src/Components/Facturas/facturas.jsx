import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Components/header/header';
import Footer from '../../Components/footer/footer';
import './facturas.css';
import { API_URL } from '../../config/config';
import { facturaApi } from '../../Api/facturaApi';

const Facturas = () => {
    const navigate = useNavigate();
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyAndGetToken = () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            console.log('Token encontrado:', token ? 'Sí' : 'No');
            console.log('Token length:', token?.length);
            
            if (!token) {
                throw new Error('No hay token almacenado');
            }
            
            try {
                // Verificar que el token sea válido
                const parts = token.split('.');
                if (parts.length !== 3) {
                    throw new Error('Formato de token inválido');
                }
                
                const payload = JSON.parse(atob(parts[1]));
                console.log('Payload del token:', payload);
                
                if (!payload.IdUsuario) {
                    throw new Error('Token no contiene IdUsuario');
                }
                
                return { token, payload };
            } catch (e) {
                console.error('Error procesando token:', e);
                // Si hay error, limpiar tokens inválidos
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                throw new Error('Token inválido');
            }
        };

        const fetchFacturas = async () => {
            try {
                const { token, payload } = verifyAndGetToken();
                console.log('Token verificado:', token.substring(0, 20) + '...');
                console.log('ID de usuario:', payload.IdUsuario);

                const data = await facturaApi.getFacturasByUsuario(payload.IdUsuario);
                setFacturas(data);
                setLoading(false);
            } catch (err) {
                console.error('Error en fetchFacturas:', err);
                if (err.message.includes('No hay token') || err.message.includes('Token inválido')) {
                    navigate('/login', {
                        replace: true,
                        state: { 
                            from: '/facturas',
                            message: 'Por favor inicie sesión nuevamente'
                        }
                    });
                }
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFacturas();
    }, [navigate]);

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