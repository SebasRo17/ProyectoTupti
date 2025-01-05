import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import './modalProducto.css';
import { createCalificacion, getCalificaciones } from '../../Api/calificacionApi';
import { addToCart } from '../../Api/carritoApi.js';

const ModalProducto = ({ product, onClose }) => {
    const [cantidad, setCantidad] = useState(1);
    const [calificacion, setCalificacion] = useState(0);
    const [resena, setResena] = useState('');
    const [reseñaError, setReseñaError] = useState('');
    const [reseñas, setReseñas] = useState([]);
    const [mensajeExito, setMensajeExito] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        console.log('Producto recibido en modal:', product);
    }, [product]);

    const procesarImagenes = (producto) => {
        console.log('Procesando imágenes para:', producto);
        
        if (!producto) {
            console.log('No hay producto');
            return ['URL_IMAGEN_DEFAULT'];
        }

        if (typeof producto.Imagenes === 'string') {
            console.log('Imágenes en string:', producto.Imagenes);
            return producto.Imagenes.split(',');
        }

        if (Array.isArray(producto.Imagenes)) {
            console.log('Array de imágenes:', producto.Imagenes);
            return producto.Imagenes.map(img => 
                img.ImagenUrl || img.imagen || 'URL_IMAGEN_DEFAULT'
            );
        }

        if (producto.ImagenUrl) {
            console.log('URL única de imagen:', producto.ImagenUrl);
            return [producto.ImagenUrl];
        }
        
        console.log('Sin imágenes, usando default');
        return ['URL_IMAGEN_DEFAULT'];
    };


    useEffect(() => {
        if (product) {
            cargarReseñas();
        }
    }, [product]);

    const cargarReseñas = async () => {
        try {
            const data = await getCalificaciones(product.IdProducto);
            setReseñas(data || []);
        } catch (error) {
            console.error('Error al cargar reseñas:', error);
            setReseñas([]);
        }
    };

    const handleCalificacionClick = (valor) => {
        setCalificacion(valor);
    };

    const handleEnviarResena = async () => {
        setReseñaError('');
        setMensajeExito('');
        
        if (!calificacion) {
            setReseñaError('Debes seleccionar una calificación');
            return;
        }

        try {
            await createCalificacion({
                idProducto: product.IdProducto,
                idUsuario: 1,
                comentario: resena.trim() || null,
                puntuacion: calificacion
            });
            
            await cargarReseñas();
            setCalificacion(0);
            setResena('');
            setMensajeExito('¡Reseña enviada exitosamente!');
            
            setTimeout(() => {
                setMensajeExito('');
            }, 3000);
        } catch (error) {
            setReseñaError(error.message);
        }
    };
    const handleAgregarCarrito = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                alert('Debe iniciar sesión para agregar productos al carrito');
                return;
            }
    
            const payload = jwtDecode(token);
    
            if (!payload.user || !payload.user.IdUsuario) {
                throw new Error('Token inválido o expirado');
            }
    
            const productData = {
                idUsuario: payload.user.IdUsuario,
                idProducto: product.IdProducto,
                cantidad: cantidad
            };
    
            console.log('Datos a enviar:', productData);
    
            const result = await addToCart(productData);
            console.log('Respuesta del servidor:', result);
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);

            if (result?.mensaje) {
                if (
                    result.mensaje === 'Producto agregado al carrito exitosamente' ||
                    result.mensaje === 'Cantidad actualizada en el carrito'
                ) {
                    return; // Salida temprana si la operación fue exitosa
                }
            } else {
                // Lanza un error si el mensaje de la API indica lo contrario
                throw new Error(result?.mensaje || 'Error al agregar al carrito');
            }
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            
        }
    };
    
    
    return (
        <div className="modal-overlay1" onClick={onClose}>
                    {showSuccessMessage && (
            <div className="success-message">
                Producto agregado al carrito exitosamente
            </div>
        )}
            <div className="modal-content1" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <div className="modal-product">
                    <div className="modal-images">
                        {procesarImagenes(product).map((imagen, index) => (
                            <img 
                                key={index}
                                src={imagen}
                                alt={`${product.Nombre} - imagen ${index + 1}`}
                                className="modal-image"
                                onError={(e) => {
                                    e.target.src = 'URL_IMAGEN_DEFAULT';
                                }}
                            />
                        ))}
                    </div>
                    <div className="modal-info">
                        <h2>{product.Nombre}</h2>
                        <p className="modal-precio">{product.Precio}</p>
                        <p className="modal-descripcion">{product.Descripcion}</p>
                        
                        <div className="cantidad-container">
                            <label htmlFor="cantidad">Cantidad:</label>
                            <input 
                                type="number" 
                                id="cantidad" 
                                min="1" 
                                max="99"
                                value={cantidad}
                                className="cantidad-input"
                                onChange={(e) => setCantidad(parseInt(e.target.value))}
                            />
                        </div>
                        
                        <button 
                            className="btn-agregar-carrito" 
                            onClick={handleAgregarCarrito}
                        >
                            Agregar al Carrito
                        </button>

                        <div className="resenas-container">
                            <h3>Deja tu reseña</h3>
                            {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
                            <div className="estrellas-container">
                                {[1,2,3,4,5].map((estrella) => (
                                    <span 
                                        key={`rating-${estrella}`}
                                        className={`estrella ${estrella <= calificacion ? 'activa' : ''}`}
                                        onClick={() => handleCalificacionClick(estrella)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleEnviarResena();
                            }} className="resena-form">
                                <textarea 
                                    className="resena-input"
                                    placeholder="Escribe tu reseña aquí (opcional)..."
                                    rows="4"
                                    value={resena}
                                    onChange={(e) => setResena(e.target.value)}
                                />
                                {reseñaError && <p className="error-message">{reseñaError}</p>}
                                <button type="submit" className="btn-enviar-resena">
                                    Enviar Reseña
                                </button>
                            </form>

                            <div className="resenas-seccion">
                                <h3>Reseñas del Producto</h3>
                                {reseñas.length > 0 ? (
                                    <div className="resenas-lista">
                                        {reseñas.map((reseña) => (
                                            <div key={`review-${reseña.IdCalificacion}`} className="resena-card">
                                                <div className="resena-header">
                                                    <div className="usuario-info">
                                                        <strong>{reseña.NombreUsuario}</strong>
                                                        <span className="fecha-resena">
                                                            {new Date(reseña.FechaReseña).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="puntuacion">
                                                        {[...Array(5)].map((_, index) => (
                                                            <span 
                                                                key={`star-${reseña.IdCalificacion}-${index}`} 
                                                                className={`estrella ${index < reseña.Puntuacion ? 'activa' : ''}`}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                {reseña.Comentario && (
                                                    <p className="resena-comentario">{reseña.Comentario}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-resenas">No hay reseñas para este producto aún.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalProducto;