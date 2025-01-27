import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx'; 
import './pantallaAdmin.css'
import { Pie, Bar } from 'react-chartjs-2';
import { getAllPedidosWithBasicInfo } from '../../Api/pedidoApi';
import { getUsersInfo } from '../../Api/userApi';
import { getAllDiscounts } from '../../Api/descuentosApi';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PantallaAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState({ activos: 0, inactivos: 0 });
  const [descuentos, setDescuentos] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar pedidos
        const pedidosData = await getAllPedidosWithBasicInfo();
        setPedidos(pedidosData);

        // Cargar usuarios - Corregido para usar el campo estado
        const usuariosData = await getUsersInfo();
        const usuariosActivos = usuariosData.filter(u => u.estado === "Activo").length;
        const usuariosInactivos = usuariosData.filter(u => u.estado === "Inactivo").length;
        setUsuarios({ activos: usuariosActivos, inactivos: usuariosInactivos });

        // Cargar descuentos
        const descuentosData = await getAllDiscounts();
        setDescuentos(descuentosData.filter(d => d.estado));
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    cargarDatos();
  }, []);

  const pieData = {
    labels: ['Entregadas', 'En Espera', 'Reembolsadas'],
    datasets: [{
      data: [
        pedidos.filter(p => p.estado === 2).length,
        pedidos.filter(p => p.estado === 0).length,
        pedidos.filter(p => p.estado === 1).length
      ],
      backgroundColor: ['#4caf50', '#ffc107', '#f44336']
    }]
  };

  const barData = {
    labels: ['01/12/24', '02/12/24', '03/12/24', '04/12/24', '05/12/24', '06/12/24', '07/12/24'],
    datasets: [{
      label: 'Visualizaciones diarias',
      data: [120, 190, 150, 280, 200, 160, 240],
      backgroundColor: '#4CAF50'
    }]
  };

  return (
    <div className="PantallaAdmin">
      <HeaderAdmin />
      <BarraLateralAdmin />
      <div className="dashboard">
        <h1>Dashboard</h1>
         <div className="overview">
      <div className="stats">
        <div className="stat">
          <h3>150</h3>
          <p>Ordenes Completas</p>
          <span className="positive">+14.36%</span>
        </div>
        <div className="stat">
          <h3>45</h3>
          <p>Ordenes Confirmadas</p>
          <span className="positive">+45.21%</span>
        </div>
        <div className="stat">
          <h3>12</h3>
          <p>Ordenes Canceladas</p>
          <span className="negative">-12%</span>
        </div>
        <div className="stat">
          <h3>8</h3>
          <p>Ordenes Reembolsadas</p>
          <span className="negative">-5.36%</span>
        </div>
      </div>
      <div className="pie-chart-container">
        <h3>Estado de Órdenes</h3>
        <div className="pie-chart">
          <Pie data={pieData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
        <div className="chart-section">
          <div className="chart-card">
            <h3>Visualizaciones de la Página</h3>
            <div className="chart-placeholder">
              <Bar data={barData} options={{ responsive: true }} />
            </div>
          </div>
          <div className="chart-card">
            <h3>Descuentos Activos</h3>
            <div className="discount-list">
              {descuentos.map((descuento) => (
                <div key={descuento.id} className="discount-item">
                  <span className="product-name">{descuento.nombre}</span>
                  <span className="discount-badge2">-{descuento.porcentaje}%</span>
                </div>
              ))}
              {descuentos.length === 0 && (
                <div className="discount-item">
                  <span className="product-name">No hay descuentos activos</span>
                </div>
              )}
            </div>
          </div>
          <div className="report-card">
            <ul>
              <li>Usuarios Activos: <span className="positive">{usuarios.activos}</span></li>
              <li>Usuarios Inhabilitados: <span className="negative">{usuarios.inactivos}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PantallaAdmin;