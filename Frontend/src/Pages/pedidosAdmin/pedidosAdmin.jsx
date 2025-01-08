import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx'; 
import './pedidosAdmin.css';
import DetallePedido from '../detallePedido/detallePedido.jsx';
const PedidosAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Mock data - replace with real data
  const stats = {
    completadas: 150,
    confirmadas: 45,
    canceladas: 12,
    reembolsadas: 8
  };

    const pedidos = [
        {
            id: '001',
            cliente: 'Juan Pérez',
            estado: 'cancelado',
            fecha: '2024-03-15',
            direccion: 'Av. Principal 123, Quito',
            telefono: '0998123456',
            email: 'juan@example.com',
            items: [
                {
                    id: 1,
                    name: "Nintendo Switch",
                    price: 299.99,
                    discount: 15,
                    quantity: 1
                }
            ]
        }
    ];

    const handleVerDetalles = (pedidoId) => {
        //console.log('Navegando a:', pedidoId);
        navigate(`/DetallePedido/${pedidoId}`);
    };

  const getStatusColor = (estado) => {
    const colors = {
      cancelado: 'red',
      confirmado: 'green',
      enviado: 'purple',
      completado: 'blue'
    };
    return colors[estado];
  };

  return (
    <div className="pedidos-admin">
              <HeaderAdmin />
              <BarraLateralAdmin />
              <h1>PEDIDOS</h1>
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar pedido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn">🔍 Buscar</button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Ordenes Completas</h3>
          <p>{stats.completadas}</p>
        </div>
        <div className="stat-card">
          <h3>Ordenes Confirmadas</h3>
          <p>{stats.confirmadas}</p>
        </div>
        <div className="stat-card">
          <h3>Ordenes Canceladas</h3>
          <p>{stats.canceladas}</p>
        </div>
        <div className="stat-card">
          <h3>Ordenes Reembolsadas</h3>
          <p>{stats.reembolsadas}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>N° Orden</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{pedido.cliente}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(pedido.estado) }}
                  >
                    {pedido.estado}
                  </span>
                </td>
                <td>{pedido.fecha}</td>
                <td>
                <button
                    onClick={() => handleVerDetalles(pedido.id)}
                    className="action-btn"
                >
                    Ver Detalles
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PedidosAdmin;