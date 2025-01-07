import React, { useState } from 'react';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin';
import FiltroUsuario from '../../Components/filtroUsuarios/filtroUsuario';
import './usuariosAdmin.css';

const UsuariosAdmin = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock data
  const users = [
    {
      id: "USR001",
      nombre: "Juan Pérez",
      email: "juan@example.com",
      fechaRegistro: "2024-03-15",
      estado: "Activo",
      direccion: "Registrada",
      registro: "Completo"
    }
  ];

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Add delete logic here
    setShowDeleteModal(false);
  };

  return (
    <div className="usuarios-admin">
      <HeaderAdmin />
      <BarraLateralAdmin />
      <h2>Gestión de Usuarios</h2>
      
      <FiltroUsuario />
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Fecha Registro</th>
              <th>Estado</th>
              <th>Dirección</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>{user.fechaRegistro}</td>
                <td>
                  <span className={`status ${user.estado.toLowerCase()}`}>
                    {user.estado}
                  </span>
                </td>
                <td>{user.direccion}</td>
                <td>{user.registro}</td>
                <td>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(user)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="modal-wrapper">
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)} />
          <div className="modal-content">
            <h3>Eliminar Usuario</h3>
            <p>
              ¿Está seguro que desea eliminar al usuario {selectedUser.nombre}?
            </p>
            <div className="modal-buttons">
              <button 
                className="cancel-btn" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="delete-btn" 
                onClick={confirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosAdmin;