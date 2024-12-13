import React from "react";
import './headerAdmin.css';

const HeaderAdmin = () => {
  return (
    <header className="headerAdmin">
      <div className="header-search">
        <input type="text" placeholder="Buscar..." className="search-input" />
        <button className="search-button">🔍</button>
      </div>
      <div className="header-actions">
        <button className="action-button">🔔</button>
        <button className="action-button">💬</button>
        <div className="profile-icon">B</div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
