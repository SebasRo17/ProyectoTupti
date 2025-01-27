import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPedidosWithBasicInfo } from '../../Api/pedidoApi';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx'; 
import ExportModal from '../../Components/exportModal/exportModal.jsx';
import './pedidosAdmin.css';

const PedidosAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showExportModal, setShowExportModal] = useState(false);

  // Modificar la estructura inicial de stats
  const [stats, setStats] = useState({
    espera: 0,
    entregadas: 0,
    reembolsadas: 0
  });

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const datos = await getAllPedidosWithBasicInfo();
      setPedidos(datos);
      calcularEstadisticas(datos);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setLoading(false);
    }
  };

  // Modificar la función de cálculo de estadísticas
  const calcularEstadisticas = (pedidosData) => {
    const stats = {
      espera: 0,
      entregadas: 0,
      reembolsadas: 0
    };

    pedidosData.forEach(pedido => {
      switch (pedido.estado) {
        case 0: stats.espera++; break;      // Pedidos en espera
        case 1: stats.reembolsadas++; break; // Pedidos reembolsados
        case 2: stats.entregadas++; break;   // Pedidos entregados
        default: break;
      }
    });

    setStats(stats);
  };

  // Agregar función de filtrado
  const filteredPedidos = pedidos.filter(pedido => {
    const searchLower = searchTerm.toLowerCase();
    return pedido.idPedido.toString().includes(searchLower) || 
           pedido.nombreUsuario.toLowerCase().includes(searchLower);
  });

  const getStatusText = (estado) => {
    switch (estado) {
      case 0: return 'espera';
      case 1: return 'reembolsado';
      case 2: return 'entregado';
      default: return 'desconocido';
    }
  };

  const getStatusColor = (estado) => {
    const colors = {
      espera: 'orange',
      reembolsado: 'red',
      entregado: 'green',
      desconocido: 'gray'
    };
    return colors[getStatusText(estado)];
  };

  const handleVerDetalles = (pedidoId) => {
    navigate(`/DetallePedido/${pedidoId}`);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="pedidos-admin">
      <HeaderAdmin />
      <BarraLateralAdmin />
      <h1>PEDIDOS</h1>
      
      {/* Search Bar - Modificar el placeholder */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por N° Orden o Cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Remover botón de buscar ya que la búsqueda será en tiempo real */}
        <button className="export-button" onClick={() => setShowExportModal(true)}>
          Exportar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>En Espera</h3>
          <p>{stats.espera}</p>
        </div>
        <div className="stat-card">
          <h3>Entregadas</h3>
          <p>{stats.entregadas}</p>
        </div>
        <div className="stat-card">
          <h3>Reembolsadas</h3>
          <p>{stats.reembolsadas}</p>
        </div>
        <div className="stat-card">
          <h3>Total Pedidos</h3>
          <p>{stats.espera + stats.entregadas + stats.reembolsadas}</p>
        </div>
      </div>

      {/* Orders Table - Modificar para usar pedidos filtrados */}
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
            {filteredPedidos.map((pedido) => (
              <tr key={pedido.idPedido}>
                <td>{pedido.idPedido}</td>
                <td>{pedido.nombreUsuario}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(pedido.estado) }}
                  >
                    {getStatusText(pedido.estado)}
                  </span>
                </td>
                <td>{new Date(pedido.fechaActualizacion).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleVerDetalles(pedido.idPedido)}
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

      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
};

export default PedidosAdmin;