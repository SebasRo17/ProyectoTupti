import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Components/header/header';
import Footer from '../../Components/footer/footer';
import './facturas.css';
import { API_URL } from '../../config/config';
import { facturaApi } from '../../Api/facturaApi';

const Facturas = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFacturas = async () => {
            try {
                // Debug storage
                console.group('Estado de almacenamiento');
                console.table({
                    'sessionStorage token': sessionStorage.getItem('token'),
                    'localStorage token': localStorage.getItem('token'),
                    'cookies': document.cookie
                });
                console.groupEnd();

                // Obtener token de cualquier almacenamiento
                const sessionToken = sessionStorage.getItem('token') || localStorage.getItem('token');

                if (!sessionToken) {
                    console.error('📛 Error de autenticación: No se encontró token en ningún almacenamiento');
                    throw new Error('No hay sesión activa. Por favor, inicie sesión nuevamente.');
                }

                // Debug token y decodificación
                let payload;
                try {
                    console.group('Información del Token');
                    const base64Url = sessionToken.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
                        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                    ).join(''));
                    payload = JSON.parse(jsonPayload);
                    console.table(payload);
                    console.groupEnd();
                } catch (e) {
                    console.error('Error decodificando token:', e);
                    throw new Error('Token inválido o malformado');
                }

                if (!payload.IdUsuario) {
                    console.error('Payload sin IdUsuario:', payload);
                    throw new Error('Token no contiene información de usuario válida');
                }

                console.log('UserId extraído:', payload.IdUsuario);
                const data = await facturaApi.getFacturasByUsuario(payload.IdUsuario);
                console.log('Datos recibidos de la API:', data);
                
                setFacturas(data);
                setLoading(false);
            } catch (err) {
                console.group('🚨 Error en Facturas');
                console.error('Tipo de error:', err.name);
                console.error('Mensaje:', err.message);
                console.error('Stack:', err.stack);
                console.groupEnd();
                
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