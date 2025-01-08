import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx'; 
import './pantallaAdmin.css'
import { Pie, Bar } from 'react-chartjs-2';
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
  const pieData = {
    labels: ['Completas', 'Confirmadas', 'Canceladas', 'Reembolsadas'],
    datasets: [{
      data: [150, 45, 12, 8],
      backgroundColor: ['#4caf50', '#ffc107', '#f44336', '#9e9e9e']
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
      <div className="discount-item">
        <span className="product-name">Tomate</span>
        <span className="discount-badge">-15%</span>
      </div>
      <div className="discount-item">
        <span className="product-name">Coca Cola</span>
        <span className="discount-badge">-25%</span>
      </div>
      <div className="discount-item">
        <span className="product-name">Cerveza Pilsener</span>
        <span className="discount-badge">-20%</span>
      </div>
      <div className="discount-item">
        <span className="product-name">Dog Chow 2kg</span>
        <span className="discount-badge">-30%</span>
      </div>
    </div>
  </div>
          <div className="report-card">
            <ul>
              <li>Usuarios Activos: <span className="positive">3</span></li>
              <li>Usuarios Inhabilitados: <span className="negative">3</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PantallaAdmin;