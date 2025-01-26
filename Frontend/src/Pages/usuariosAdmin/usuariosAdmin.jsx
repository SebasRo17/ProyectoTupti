import React, { useState, useEffect } from 'react';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin';
import FiltroUsuario from '../../Components/filtroUsuarios/filtroUsuario';
import EditarUsuario from '../../Components/editarUsuario/editarUsuario';
import { getUsersInfo, deactivateUser } from '../../Api/userApi';
import './usuariosAdmin.css';

const UsuariosAdmin = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsersInfo();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleEdit = (userId) => {
    setSelectedUser(users.find((user) => user.id === userId));
    setShowEditModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deactivateUser(selectedUser.id);
      // Actualizar la lista de usuarios después de desactivar
      const updatedUsers = await getUsersInfo();
      setUsers(updatedUsers);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error al desactivar usuario:', error);
      // Opcionalmente, mostrar un mensaje de error al usuario
    }
  };

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error: {error}</div>;

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
              <th>Estado</th>
              <th>Dirección</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.codigo}</td>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`status ${user.estado.toLowerCase()}`}>
                    {user.estado}
                  </span>
                </td>
                <td>{user.tieneDireccion ? 'Registrada' : 'No registrada'}</td>
                <td>{user.registro}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(user.id)}>
                    ✏️
                  </button>
                  <button 
                    className="delete-btn0"
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
          <div className="modal-content10">
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