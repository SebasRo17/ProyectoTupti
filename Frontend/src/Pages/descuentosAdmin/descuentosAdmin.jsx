import React, { useState, useEffect } from 'react';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx'; 
import FiltroAdmin from '../../Components/filtroAdmin/filtroAdmin.jsx';
import EditarDescuento from '../../Components/editarDescuento/editarDescuento.jsx';
import NuevoDescuento from '../../Components/nuevoDescuento/nuevoDescuento.jsx';
import './descuentosAdmin.css';
import { getAllDiscounts, deleteDiscount } from '../../Api/descuentosApi.js';

const DescuentosAdmin = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isNuevoDescuentoOpen, setIsNuevoDescuentoOpen] = useState(false);
    const [filterState, setFilterState] = useState(''); // Estado para el filtro de estado
    const [filterName, setFilterName] = useState(''); // Estado para el filtro de nombre

    const fetchDiscounts = async () => {
        try {
            setLoading(true);
            const data = await getAllDiscounts();
            const formattedDiscounts = data.map((discount, index) => {
                // Add timezone offset to prevent day shift
                const fechaInicio = new Date(discount.fechaInicio);
                const fechaFin = new Date(discount.fechaFin);
                
                // Adjust for timezone
                fechaInicio.setMinutes(fechaInicio.getMinutes() + fechaInicio.getTimezoneOffset());
                fechaFin.setMinutes(fechaFin.getMinutes() + fechaFin.getTimezoneOffset());
        
                return {
                    id: index + 1,
                    producto: discount.nombre,
                    descuento: discount.porcentaje,
                    estado: discount.estado === true ? "Activo" : "Inactivo",
                    fechaInicio: fechaInicio.toLocaleDateString(),
                    fechaFin: fechaFin.toLocaleDateString()
                };
            });
            setDiscounts(formattedDiscounts);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching discounts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const handleSave = async (formData) => {
        try {
            await fetchDiscounts(); // Refresh data after save
            setShowEditModal(false);
        } catch (error) {
            console.error('Error refreshing discounts:', error);
        }
    };

    const handleDelete = (discount) => {
        setSelectedDiscount(discount);
        setShowDeleteModal(true);
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    const confirmDelete = async () => {
        try {
            await deleteDiscount(selectedDiscount.id);
            await fetchDiscounts(); // Refresh data after delete
            setShowDeleteModal(false);
            document.body.style.overflow = 'auto'; // Restore scroll
        } catch (error) {
            console.error('Error deleting discount:', error);
        }
    };

    const handleEdit = (discount) => {
        setSelectedDiscount({
            id: discount.id,
            producto: discount.producto,
            descuento: discount.descuento,
            estado: discount.estado, 
            fechaInicio: discount.fechaInicio,
            fechaFin: discount.fechaFin
        });
        setShowEditModal(true);
    };

    const handleNuevoDescuentoOpen = () => {
        setIsNuevoDescuentoOpen(true);
    };

    const handleNuevoDescuentoClose = () => {
        setIsNuevoDescuentoOpen(false);
    };

    const handleDescuentoAdded = () => {
        fetchDiscounts();
    };

    // Filtrar descuentos
    const filteredDiscounts = discounts.filter(discount => {
        return (
            (filterState === '' || discount.estado === filterState) &&
            (filterName === '' || discount.producto.toLowerCase().includes(filterName.toLowerCase()))
        );
    });

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
            <FiltroAdmin 
                showNewProduct={false} 
                showNewDiscount={true}
                onFilterStateChange={setFilterState}
                onFilterNameChange={setFilterName}
                discounts={discounts}
            />
           
            <NuevoDescuento
                isOpen={isNuevoDescuentoOpen}
                onClose={handleNuevoDescuentoClose}
                onDescuentoAdded={handleDescuentoAdded}
            />

            {loading ? (
                <p>Cargando descuentos...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
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
                            {filteredDiscounts.map((discount) => (
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
                                        <button className="edit-btn" onClick={() => handleEdit(discount)}>
                                            ✏️
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(discount)}>
                                            🗑️
                                        </button>
                                        {showEditModal && selectedDiscount && (
                                            <EditarDescuento
                                                descuento={selectedDiscount}
                                                onClose={() => setShowEditModal(false)}
                                                onSave={handleSave}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DescuentosAdmin;