import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx';
import EditarProductos from '../../Components/editarProductos/editarProductos.jsx';
import './productosAdmin.css';
import './responsiveproductosAdmin.css';
import NuevoProducto from "../nuevoProductoAdmin/nuevoProductoAdmin.jsx";
import FiltroAdmin from '../../Components/filtroAdmin/filtroAdmin.jsx';
import { productosApi } from '../../Api/productosApi';
import { sumCantidadByIdProducto } from '../../Api/kardexApi';

const ProductosAdmin = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

    const getImageUrl = (product) => {
        if (!product) return '/images/placeholder.png';
        
        if (product.Imagenes && product.Imagenes.length > 0) {
            return product.Imagenes[0].ImagenUrl;
        }
        
        return '/images/placeholder.png';
    };
    
    useEffect(() => {
        fetchProductos();
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (productos.length > 0) {
            setProductosFiltrados(productos);
        }
    }, [productos]);

    const fetchProductos = async () => {
        try {
            const data = await productosApi.getAllProducts();
            console.log('Productos:', data);
            if (Array.isArray(data)) {
                const productosConImagen = await Promise.all(data.map(async (product) => {
                    const totalCantidad = await sumCantidadByIdProducto(product.IdProducto);
                    return {
                        ...product,
                        ImagenUrl: product.imagen || product.imagenUrl || product.ImagenUrl || '/images/placeholder.png',
                        totalCantidad
                    };
                }));
                setProductos(productosConImagen);
            } else {
                setError('Formato de datos incorrecto');
            }
            setLoading(false);
        } catch (error) {
            setError('Error al cargar los productos');
            setLoading(false);
        }
    };

    const fetchCategorias = async () => {
        try {
            const response = await fetch('tu-api/categorias');
            const data = await response.json();
            setCategorias(data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const handleDelete = (productId) => {
        setSelectedProduct(productId);
        setShowDeleteModal(true);
        document.body.style.overflow = 'hidden';
    };
    
    const confirmDelete = async () => {
        try {
            await productosApi.deleteProduct(selectedProduct);
            fetchProductos();
            setShowDeleteModal(false);
            document.body.style.overflow = 'auto';
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setProductosFiltrados(productos);
            return;
        }

        const filtered = productos.filter(product =>
            product.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProductosFiltrados(filtered);
    };

    const handleSuggestionClick = (product) => {
        setSearchTerm(product.Nombre);
        setShowSuggestions(false);
    };

    const handleEdit = (productId) => {
        const productToEdit = productos.find(product => product.IdProducto === productId);
        setSelectedProduct(productToEdit);
        setIsEditModalOpen(true);
    };

    const handleOpenModal = (product) => {
        const formattedProduct = {
            id: product.IdProducto,
            name: product.Nombre,
            details: product.Descripcion,
            price: product.Precio,
            image: product.Imagenes?.[0]?.ImagenUrl,
            imagenesArray: product.Imagenes
        };
        setSelectedProduct(formattedProduct);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    const handleFilterCategory = (categoria) => {
        if (!categoria) {
            setProductosFiltrados(productos);
        } else {
            const filtered = productos.filter(producto => 
                producto.TipoProducto?.detalle === categoria
            );
            setProductosFiltrados(filtered);
        }
    };

    return (
        <div className="PantallaProductos">
            <HeaderAdmin />
            <BarraLateralAdmin />
            <div className="productos-container">
                <h1>Productos</h1>
                {isEditModalOpen && selectedProduct && (
                    <div className="modal-container">
                        <EditarProductos 
                            product={selectedProduct}
                            onClose={() => {
                                setIsEditModalOpen(false);
                                setSelectedProduct(null);
                            }}
                        />
                    </div>
                )}
                {showDeleteModal && selectedProduct && (
                    <div className="modal-wrapper3">
                        <div className="modal-overlay3" onClick={() => setShowDeleteModal(false)} />
                        <div className="modal-content3">
                            <h3>Eliminar Producto</h3>
                            <p>
                                ¿Está seguro que desea eliminar el producto <span className="product-name">{selectedProduct.Nombre}</span>?
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
                <FiltroAdmin 
                    showNewProduct={true} 
                    showNewDiscount={false} 
                    onSearch={handleSearch}
                    onFilterCategory={handleFilterCategory}
                    categorias={categorias}
                />
                <main className="product-grid">
                    {loading ? (
                        <p>Cargando productos...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        productosFiltrados.map((product) => (
                            <div className="product-card" key={product.IdProducto}>
                            <div className="image-container">
                                {product.descuento && (
                                    <div className="discount-badge">
                                        <span className="discount-text">{product.descuento.porcentaje}% </span>
                                    </div>
                                )}
                                <img 
                                    src={getImageUrl(product)} 
                                    alt={product.Nombre || 'Producto'} 
                                    className="product-image" 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/placeholder.png';
                                    }}
                                />
                            </div>

                            <h3 className="product-title">{product.Nombre}</h3>
                            <p className="product-details">{product.Descripcion}</p>
                            <p className="product-stock">Cantidad Total: {product.totalCantidad}</p>

                            {product.descuento ? (
                                <div className="price-container">
                                    <p className="product-price original">${product.Precio}</p>
                                    <p className="product-price discounted">${product.descuento.precioConDescuento}</p>
                                </div>
                            ) : (
                                <p className="product-price">${product.Precio}</p>
                            )}

                            <div className="card-buttons">
                                <button 
                                    className="editar-button"
                                    onClick={() => handleOpenModal(product)}
                                >
                                    Editar
                                </button>
                                <button 
                                    className="delete-btn" 
                                    onClick={() => handleDelete(product.IdProducto)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>


                        ))
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductosAdmin;