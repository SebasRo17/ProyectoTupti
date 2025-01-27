import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPedidoFullDetails, getDetallesPedido } from '../../Api/pedidoApi';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx'; 
import './detallePedido.css';

const DetallePedido = () => {
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const [fullDetails, paymentInfo] = await Promise.all([
                    getPedidoFullDetails(id),
                    getDetallesPedido(id)
                ]);

                // Configurar detalles generales del pedido
                setOrderDetails({
                    idPedido: fullDetails.pedido.idPedido,
                    status: getStatusText(fullDetails.pedido.estado),
                    date: new Date(fullDetails.pedido.fechaPedido).toLocaleDateString(),
                    address: `${fullDetails.direccion.callePrincipal} ${fullDetails.direccion.numeracion}, ${fullDetails.direccion.calleSecundaria}, ${fullDetails.direccion.vecindario}, ${fullDetails.direccion.ciudad}`,
                    customer: {
                        name: fullDetails.usuario.nombre,
                        email: fullDetails.usuario.email
                    },
                    items: fullDetails.productos.map(prod => ({
                        id: prod.idProducto,
                        name: prod.nombreProducto,
                        price: parseFloat(prod.precioUnitario) || 0, // Asegurar que sea número
                        quantity: parseInt(prod.cantidad) || 0,      // Asegurar que sea número
                        discount: 0 // Por ahora lo dejamos en 0 ya que no viene del backend
                    }))
                });

                // Configurar detalles del pago
                setPaymentDetails({
                    subtotal: paymentInfo.totales.subtotal,
                    descuentos: paymentInfo.totales.descuentos,
                    impuestos: paymentInfo.totales.impuestos,
                    total: paymentInfo.totales.total
                });

                setLoading(false);
            } catch (error) {
                console.error('Error al obtener detalles del pedido:', error);
                navigate('/pedidosAdmin');
            }
        };

        if (id) {
            fetchOrderDetails();
        }
    }, [id, navigate]);

    const getStatusText = (estado) => {
        switch (estado) {
            case 0: return 'En Espera';
            case 1: return 'Reembolsado';
            case 2: return 'Entregado';
            default: return 'Desconocido';
        }
    };

    if (loading) {
        return <div className="loading">Cargando detalles del pedido...</div>;
    }

    const calculateItemTotal = (item) => {
        return item.price * item.quantity;
    };

    return (
        <div className="detalle-pedido">
             <HeaderAdmin />
             <BarraLateralAdmin />
             <div className="header-container">
                <button 
                    className="back-button"
                    onClick={() => navigate('/pedidosAdmin')}
                >
                    Atrás
                </button>
            </div>
            <div className="top-sections-container">
                <div className="order-info">
                    <h2>Detalles del Pedido</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">N° Orden:</span>
                            <span className="value">{orderDetails.idPedido}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Estado:</span>
                            <span className={`status ${orderDetails.status.toLowerCase()}`}>
                                {orderDetails.status}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="label">Fecha:</span>
                            <span className="value">{orderDetails.date}</span>
                        </div>
                    </div>

                    <div className="address-info">
                        <h3>Dirección de Entrega</h3>
                        <p>{orderDetails.address}</p>
                    </div>
                </div>
            

            <div className="customer-section">
                <h3>Datos del Cliente</h3>
                <div className="customer-info">
                    <div className="info-item">
                        <span className="label">Nombre:</span>
                        <span className="value">{orderDetails.customer.name}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Teléfono:</span>
                        <span className="value">{orderDetails.customer.phone}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Email:</span>
                        <span className="value">{orderDetails.customer.email}</span>
                    </div>
                </div>
            </div>
            </div>

            <div className="order-items-section">
                <h3>Productos del Pedido</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Descuento</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                    <td>{item.discount}%</td>
                                    <td>{item.quantity}</td>
                                    <td>${calculateItemTotal(item).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="payment-info-section">
                <h3>Información de Pago</h3>
                <div className="payment-summary">
                    <div className="summary-item">
                        <span>Subtotal:</span>
                        <span>${paymentDetails?.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <span>Descuentos:</span>
                        <span>-${paymentDetails?.descuentos.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <span>IVA:</span>
                        <span>${paymentDetails?.impuestos.toFixed(2)}</span>
                    </div>
                    <div className="summary-item total">
                        <span>Total:</span>
                        <span>${paymentDetails?.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetallePedido;