import React ,  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx';
import EditarProductos from '../../Components/editarProductos/editarProductos.jsx'
import './productosAdmin.css';

import './responsiveproductosAdmin.css';
import NuevoProducto from "../nuevoProductoAdmin/nuevoProductoAdmin.jsx";
import FiltroAdmin from '../../Components/filtroAdmin/filtroAdmin.jsx';

import { productosApi } from '../../Api/productosApi';

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

    // Añadir esta función para manejar las URLs de imágenes
    const getImageUrl = (product) => {
        if (!product) return '/images/placeholder.png';
        
        // Verificar si hay imágenes disponibles
        if (product.Imagenes && product.Imagenes.length > 0) {
            return product.Imagenes[0].ImagenUrl;
        }
        
        // Si no hay imágenes, usar placeholder
        return '/images/placeholder.png';
    };
    
    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const data = await productosApi.getAllProducts();
            if (Array.isArray(data)) {
                const productosConImagen = data.map(product => ({
                    ...product,
                    ImagenUrl: product.imagen || product.imagenUrl || product.ImagenUrl || '/images/placeholder.png'
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

    const handleDelete = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
        document.body.style.overflow = 'hidden';
    };
    
    const confirmDelete = async () => {
        try {
            await productosApi.deleteProduct(selectedProduct.id);
            fetchProductos();
            setShowDeleteModal(false);
            document.body.style.overflow = 'auto';
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
      
        if (value.length > 0) {
          const filteredProducts = productos.filter(product =>
            product.name.toLowerCase().includes(value.toLowerCase())
          );
          setSuggestions(filteredProducts);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      };
      
      const handleSuggestionClick = (product) => {
        setSearchTerm(product.name);
        setShowSuggestions(false);
      };

      const handleEdit = (productId) => {
        const productToEdit = productos.find(product => product.id === productId);
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
        {showDeleteModal && selectedProduct &&(
        <div className="modal-wrapper3">
          <div className="modal-overlay3" onClick={() => setShowDeleteModal(false)} />
          <div className="modal-content3">
            <h3>Eliminar Descuento</h3>
            <p>
              ¿Está seguro que desea eliminar el producto <span className="product-name">{selectedProduct.nombre}</span>?
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
            <FiltroAdmin showNewProduct={true} showNewDiscount={false} />
                <main className="product-grid">
                    {loading ? (
                        <p>Cargando productos...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        productos.map((product) => (
                            <div className="product-card" key={product.IdProducto}>
                                <img 
                                    src={getImageUrl(product)} 
                                    alt={product.Nombre || 'Producto'} 
                                    className="product-image" 
                                    onError={(e) => {
                                        e.target.onerror = null; // Previene loop infinito
                                        e.target.src = '/images/placeholder.png';
                                    }}
                                />
                                <h3 className="product-title">{product.Nombre}</h3>
                                <p className="product-details">{product.Descripcion}</p>
                                <p className="product-price">${product.Precio}</p>
                                <div className="card-buttons">
                                <button 
                                    className="editar-button"
                                    onClick={() => handleOpenModal(product)}
                                    >
                                    Editar
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(product.IdProducto)}>
                                    Eliminar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                </main>
                    <div className="filters-container">
                    <div className="filtros-clase">
                <Filtros />
            </div>
        </div> 
        </div>
    </div>
    );
};

export default ProductosAdmin;