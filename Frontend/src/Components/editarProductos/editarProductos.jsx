import React, { useState, useEffect } from 'react';
import './editarProductos.css';
import { updatePartialProduct } from '../../Api/productosApi'; 
import { createKardexProduct } from '../../Api/kardexApi.js';
import { getProductoImagenesByIdProducto, deleteProductoImagen, createProductoImagen } from '../../Api/ProductoImagenApi.js'; 
const EditarProductos = ({ product, onClose }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        details: '',
        price: '',
        stock: '',
        imageUrl: product.imageUrl || ''
    });
    const [imagePreview, setImagePreview] = useState('');
    const [stockOperation, setStockOperation] = useState('ingreso'); // 'ingreso' o 'egreso'
    const [imagenes, setImagenes] = useState([]); // Estado para las imágenes
    const [newImageUrl, setNewImageUrl] = useState(''); // Estado para la nueva URL de la imagen

    useEffect(() => {
        if (product) {
            setFormData({
                id: product.id || '',
                name: product.name || '',
                details: product.details || '',
                price: product.price || '',
                stock: product.stock || '',
                image: product.image || ''
            });
            setImagePreview(product.image || '');

            // Obtener las imágenes del producto
            fetchProductoImagenes(product.id);
        }
    }, [product]);

    const fetchProductoImagenes = async (idProducto) => {
        try {
            const imagenes = await getProductoImagenesByIdProducto(idProducto);
            setImagenes(imagenes);
        } catch (error) {
            console.error('Error al obtener imágenes del producto:', error);
        }
    };

    const handleDeleteImagen = async (idProductoImagen) => {
        try {
            await deleteProductoImagen(idProductoImagen);
            setImagenes(imagenes.filter(imagen => imagen.IdImagen !== idProductoImagen));
        } catch (error) {
            console.error('Error al eliminar la imagen del producto:', error);
        }
    };

    const handleAddImagen = async () => {
        if (!newImageUrl) {
            alert('Por favor ingrese una URL de imagen válida');
            return;
        }
    
        // Corregimos el formato de los datos
        const imagenData = {
            IdProducto: parseInt(formData.id), // Aseguramos que sea número y usamos mayúscula
            ImagenUrl: newImageUrl
        };
        
        try {
            const nuevaImagen = await createProductoImagen(imagenData);
            setImagenes([...imagenes, nuevaImagen]);
            setNewImageUrl('');
        } catch (error) {
            console.error('Error al agregar la imagen del producto:', error);
            // Agregamos un mensaje más descriptivo para el usuario
            alert('Error al agregar la imagen. Por favor verifique la URL y vuelva a intentarlo.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStockOperationChange = (operation) => {
        setStockOperation(operation);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que los campos nombre, precio y detalles estén llenos
        if (!formData.name || !formData.price || !formData.details) {
            alert('Por favor complete los campos Nombre, Precio y Detalles');
            return;
        }

        const updateData = {
            nombre: formData.name,
            precio: formData.price,
            descripcion: formData.details
        };

        const kardexData = {
            idProducto: formData.id,
            movimiento: stockOperation === 'ingreso' ? 'Ingreso' : 'Egreso',
            cantidad: stockOperation === 'ingreso' ? parseFloat(formData.stock) : -parseFloat(formData.stock)
        };

        try {
            // Primero actualizamos el producto
            await updatePartialProduct(formData.id, updateData);
            
            // Luego creamos el registro en el kardex
            const kardexResponse = await createKardexProduct(kardexData);
            
            if (kardexResponse === null) {
                throw new Error('Error al crear el registro de kardex');
            }

            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error al actualizar el producto o crear Kardex:', error);
            alert('Ocurrió un error al guardar los cambios. Por favor intente nuevamente.');
        }
    };

    return (
        <div className="modal-overlay7">
            <div className="modal-content7">
                <h2>Editar Producto: {formData.name}</h2>
                <div className="forms-container7">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group7">
                            <label>Nombre del Producto:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group7">
                            <label>Precio:</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                            />
                        </div>
                        <div className="form-group7">
                            <label>Detalles:</label>
                            <textarea
                                name="details"
                                value={formData.details}
                                onChange={handleChange}
                            />
                        </div>
                        
                        {/* Nueva sección de manejo de stock */}
                        <div className="form-group7">
                            <label>Operación de Stock:</label>
                            <div className="stock-operations">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="stockOperation"
                                        checked={stockOperation === 'ingreso'}
                                        onChange={() => handleStockOperationChange('ingreso')}
                                    />
                                    Ingresar Stock
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="stockOperation"
                                        checked={stockOperation === 'egreso'}
                                        onChange={() => handleStockOperationChange('egreso')}
                                    />
                                    Reducir Stock
                                </label>
                            </div>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="Cantidad de stock"
                                min="0"
                            />
                        </div>

                        <div className="form-group7">
                            <label>Imágenes del Producto:</label>
                            <div className="image-preview-container">
                                {imagenes.map((imagen) => (
                                    <div key={imagen.IdImagen} className="image-container">
                                        <img 
                                            src={imagen.ImagenUrl}
                                            alt={`Imagen ${imagen.IdImagen}`}
                                            className="product-image-preview-small"
                                        />
                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={() => handleDeleteImagen(imagen.IdImagen)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-group7">
                            <label>Agregar Imágenes:</label>
                            <div className="add-image-container">
                                <input
                                    type="text"
                                    name="newImageUrl"
                                    value={newImageUrl}
                                    placeholder="Por favor ingrese la URL de la imagen a cargar"
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                />
                            </div>
                            {newImageUrl && (
                                <div className="image-container">
                                    <img 
                                        src={newImageUrl}
                                        alt="Vista previa"
                                        className="product-image-preview-small"
                                    />
                                    <button
                                        type="button"
                                        className="add-button"
                                        onClick={handleAddImagen}
                                    >
                                        ➕
                                    </button>
                                </div>
                            )}
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