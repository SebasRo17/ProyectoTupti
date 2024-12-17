import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx'; 
import './pantallaAdmin.css'


function PantallaAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario es administrador
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Limpiar cualquier dato de sesión si existe
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="PantallaAdmin">
      <HeaderAdmin />
      <BarraLateralAdmin />
      <div className="dashboard">
      <header className="dashboard-header">
        <h1>Estadísticas</h1>
      </header>
      <div className="dashboard-content">
        <div className="card overview">
          <h2>ShopPoint - Retail</h2>
          <p>
            Aliquam erat volutpat. Duis molestie ultrices tempus. Mauris sem
            orci, euismod sit amet.
          </p>
          <div className="stats">
            <div className="stat">
              <h3>$15,412</h3>
              <p>Income</p>
              <span className="positive">+45.21%</span>
            </div>
            <div className="stat">
              <h3>$53,487</h3>
              <p>Expense</p>
              <span className="negative">-12%</span>
            </div>
            <div className="stat">
              <h3>5,412</h3>
              <p>New Orders</p>
              <span className="positive">+14.36%</span>
            </div>
          </div>
        </div>
        <div className="chart-section">
          <div className="chart-card">
            <h3>Sales Statistic 2022</h3>
            <div className="chart-placeholder">[Chart Placeholder]</div>
          </div>
          <div className="report-card">
            <h3>Total Report</h3>
            <ul>
              <li>
                Revenue <span className="positive">$176,120 (+45%)</span>
              </li>
              <li>
                Expense <span className="negative">$310,452 (-12%)</span>
              </li>
              <li>
                Profit <span className="positive">$349,658 (+14.36%)</span>
              </li>
            </ul>
            <button className="details-button">More Details</button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}


export default PantallaAdmin;
