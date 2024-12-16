import React, { useState, useEffect } from 'react';
import './editarProductos.css';

const EditarProductos = ({ product, onClose }) => {
    // Initialize state with product data
    const [formData, setFormData] = useState({
        id: product?.id || '',
        name: product?.name || '',
        details: product?.details || '',
        price: product?.price || '',
        image: product?.image || ''
    });

    // Keep track of image preview
    const [imagePreview, setImagePreview] = useState(product?.image || '');

    // Update form when product changes
    useEffect(() => {
        if (product) {
            setFormData({
                id: product.id,
                name: product.name,
                details: product.details,
                price: product.price,
                image: product.image
            });
            setImagePreview(product.image);
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add validation here if needed
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Producto: {product?.name}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre del Producto:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Precio:</label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Detalles:</label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={(e) => setFormData({...formData, details: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Imagen actual:</label>
                        {imagePreview && (
                            <div className="current-image">
                                <img 
                                    src={imagePreview} 
                                    alt="Imagen actual" 
                                    className="product-image-preview"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        setImagePreview(e.target.result);
                                        setFormData(prev => ({
                                            ...prev,
                                            image: e.target.result
                                        }));
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </div>

                    <div className="modal-buttons">
                        <button type="submit" className="save-button">
                            Guardar cambios
                        </button>
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarProductos;