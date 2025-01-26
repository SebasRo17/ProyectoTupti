import React, { useState, useEffect } from 'react';
import './editarUsuario.css';

const EditarUsuario = ({ user, onClose }) => {
    const [formData, setFormData] = useState({
        id: '',
        nombre: '',
        email: '',
        fechaRegistro: '',
        estado: '',
        direccion: '',
        registro: ''
    });

    useEffect(() => {
        if (user) {
          setFormData({
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            fechaRegistro: user.fechaRegistro,
            estado: user.estado,
            direccion: user.direccion,
            registro: user.registro
          });
        }
      }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onClose(formData);
    };

    return (
        <div className="modal-overlay7">
            <div className="modal-content7">
                <h2>Editar Estado Usuario</h2>
                <div className="forms-container7">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group7">
                            <label>Código:</label>
                            <input
                                type="text"
                                value={formData.id}
                                readOnly
                                disabled
                            />
                        </div>
                        <div className="form-group7">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                value={formData.nombre}
                                readOnly
                                disabled
                            />
                        </div>
                        <div className="form-group7">
                            <label>Email:</label>
                            <input
                                type="text"
                                value={formData.email}
                                readOnly
                                disabled
                            />
                        </div>
                        <div className="form-group7">
                            <label>Fecha Registro:</label>
                            <input
                                type="text"
                                value={formData.fechaRegistro}
                                readOnly
                                disabled
                            />
                        </div>
                        <div className="form-group7">
                            <label>Estado:</label>
                            <select
                                value={formData.estado}
                                onChange={(e) => setFormData({...formData, estado: e.target.value})}
                            >
                                <option value="ACTIVO">Activo</option>
                                <option value="INACTIVO">Inactivo</option>
                            </select>
                        </div>
                        <div className="form-group7">
                            <label>Dirección:</label>
                            <input
                                type="text"
                                value={formData.direccion}
                                readOnly
                                disabled
                            />
                        </div>
                        <div className="form-group7">
                            <label>Registro:</label>
                            <input
                                type="text"
                                value={formData.registro}
                                readOnly
                                disabled
                            />
                        </div>
                        <div className="modal-buttons7">
                            <button type="submit" className="save-button7">
                                Guardar cambios
                            </button>
                            <button type="button" onClick={onClose} className="cancel-button7">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditarUsuario;