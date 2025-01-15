import React, { useState, useEffect } from 'react';
import './editarProductos.css';

const EditarProductos = ({ product, onClose }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        details: '',
        price: '',
        imageUrl: product.imageUrl || ''
    });
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        //console.log('Producto actualizado:', product);
        if (product) {
            setFormData({
                id: product.id || '',
                name: product.name || '',
                details: product.details || '',
                price: product.price || '',
                image: product.image || ''
            });
            setImagePreview(product.image || '');
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log('Submitting:', formData);
        onClose(formData);
    };

    return (
        <div className="modal-overlay7">
            <div className="modal-content7">
                <h2>Editar Producto: {formData.name}</h2>
                <div className="forms-container7">
                <form onSubmit={handleSubmit} >
                    <div className="form-group7">
                        <label>Nombre del Producto:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group7">
                        <label>Precio:</label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group7">
                        <label>Detalles:</label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={(e) => setFormData({...formData, details: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group7">
                        <label>Stock:</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={(e) => setFormData({...formData, stock: e.target.value})}
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group7">
                        <label>Imagen actual:</label>
                            <div className="image-preview-container">
                                {formData.imageUrl && (
                                    <img 
                                        src={formData.imageUrl} 
                                        alt={formData.name}
                                        className="product-image-preview"
                                    />
                                )}
                            </div>
                    <div className="form-group7">
                        <label>Agregar Imágenes:</label>
                        <input
                            type="text"
                            name="image"
                            placeholder="Por favor ingrese la URL de la imagen a cargar"
                            required
                        />
                    </div>
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

export default EditarProductos;