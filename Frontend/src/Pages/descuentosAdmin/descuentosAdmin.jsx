import React, { useState } from 'react';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx'; 
import FiltroAdmin from '../../Components/filtroAdmin/filtroAdmin.jsx';
import EditarDescuento from '../../Components/editarDescuento/editarDescuento.jsx';
import './descuentosAdmin.css';

const DescuentosAdmin = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);

  // Mock data - replace with API data
const discounts = [
    {
      id: 1,
      producto: "Nintendo Switch",
      descuento: 15,
      estado: "Inactivo",
      fechaInicio: "2024-03-15",
      fechaFin: "2024-04-15"
    },
    {
      id: 2,
      producto: "Tomate",
      descuento: 15,
      estado: "Activo",
      fechaInicio: "2024-03-01",
      fechaFin: "2024-03-31"
    },
    {
      id: 3,
      producto: "Coca Cola",
      descuento: 25,
      estado: "Activo",
      fechaInicio: "2024-03-01",
      fechaFin: "2024-03-15"
    },
    {
      id: 4,
      producto: "Cerveza Pilsener",
      descuento: 20,
      estado: "Activo",
      fechaInicio: "2024-03-05",
      fechaFin: "2024-03-20"
    },
    {
      id: 5,
      producto: "Dog Chow 2kg",
      descuento: 30,
      estado: "Activo",
      fechaInicio: "2024-03-01",
      fechaFin: "2024-03-31"
    }
  ];


  const handleDelete = (discount) => {
    setSelectedDiscount(discount);
    setShowDeleteModal(true);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const confirmDelete = () => {
    // Add delete logic here
    setShowDeleteModal(false);
    document.body.style.overflow = 'auto'; // Restore scroll
  };
  const handleEdit = (discount) => {
    setSelectedDiscount(discount);
    setShowEditModal(true);
  };
  const handleSave = (formData) => {
    // Add save logic here
    console.log('Saving:', formData);
    setShowEditModal(false);
  };
  return (

    <div className="descuentos-admin">
            <HeaderAdmin />
            <BarraLateralAdmin />
            
      {showDeleteModal && (
        <div className="modal-wrapper3">
          <div className="modal-overlay3" onClick={() => setShowDeleteModal(false)} />
          <div className="modal-content3">
            <h3>Eliminar Descuento</h3>
            <p>
              ¿Está seguro que desea eliminar el descuento del producto <span className="product-name">{selectedDiscount.producto}</span>?
            </p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button className="delete-btn" onClick={confirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      <h2>Gestión de Descuentos</h2>
      <FiltroAdmin showNewProduct={false} />
      <div className="table-container2">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Descuento (%)</th>
              <th>Estado</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.id}>
                <td>{discount.producto}</td>
                <td>{discount.descuento}%</td>
                <td>
                  <span className={`status ${discount.estado.toLowerCase()}`}>
                    {discount.estado}
                  </span>
                </td>
                <td>{discount.fechaInicio}</td>
                <td>{discount.fechaFin}</td>
                <td className="actions">
                  <button className="edit-btn" onClick={() => handleEdit(discount.id)}>
                    ✏️
                  </button>
                  {showEditModal && (
                        <EditarDescuento
                        descuento={selectedDiscount}
                        onClose={() => setShowEditModal(false)}
                        onSave={handleSave}
                        />
                    )}
                    <td className="actions">
                  <button className="delete-btn" onClick={() => handleDelete(discount)}>
                    🗑️
                  </button>
                  </td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DescuentosAdmin;