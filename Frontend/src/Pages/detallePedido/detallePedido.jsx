import React, { useState, useEffect } from 'react';
import './detallePedido.css';
import { useParams,  useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx'; 

const DetallePedido = () => {
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // Simular llamada a API
                const mockOrder = {
                    idPedido: id,
                    status: "Confirmado",
                    date: "2024-03-15",
                    address: "Av. Principal 123, Quito",
                    customer: {
                        name: "Juan Pérez",
                        phone: "0998123456",
                        email: "juan@example.com"
                    },
                    items: [
                        {
                            id: 1,
                            name: "Nintendo Switch",
                            price: 299.99,
                            discount: 15,
                            quantity: 1
                        }
                ]
            };
            setOrderDetails(mockOrder);
        } catch (error) {
            console.error('Error fetching order details:', error);
            navigate('/pedidosAdmin');
        }
    };

    if (id) {
        fetchOrderDetails();
    }
}, [id, navigate]);

if (!orderDetails) {
    return <div className="loading">Cargando detalles del pedido...</div>;
}
    const calculateItemTotal = (item) => {
        const discountedPrice = item.price - (item.price * item.discount / 100);
        return discountedPrice * item.quantity;
    };

    const subtotal = orderDetails.items.reduce((acc, item) => acc + calculateItemTotal(item), 0);
    const iva = subtotal * 0.15;
    const total = subtotal + iva;

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
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <span>IVA (15%):</span>
                        <span>${iva.toFixed(2)}</span>
                    </div>
                    <div className="summary-item total">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetallePedido;