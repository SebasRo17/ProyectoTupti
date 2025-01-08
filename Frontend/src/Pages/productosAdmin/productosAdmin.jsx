import React ,  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx';
import EditarProductos from '../../Components/editarProductos/editarProductos.jsx'
import './productosAdmin.css';
import Filtros from "../../Components/Filtros/Filtros.jsx";
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
    const [selectedProduct, setSelectedProduct] = useState(null);

    
    
    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const data = await productosApi.getAllProducts();
            setProductos(data);
            setLoading(false);
        } catch (error) {
            setError('Error al cargar los productos');
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        try {
            await productosApi.deleteProduct(productId);
            fetchProductos(); // Recargar la lista después de eliminar
        } catch (error) {
            //console.error('Error al eliminar el producto:', error);
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
        //console.log(`Editando producto ${productId}`);
        const productToEdit = productos.find(product => product.id === productId);
        setSelectedProduct(productToEdit);
        setIsEditModalOpen(true);
    };

    const handleOpenModal = (product) => {
        //console.log('Opening modal for:', product);
        const formattedProduct = {
            id: product.IdProducto,
            name: product.Nombre,
            details: product.Descripcion,
            price: product.Precio,
            image: product.ImagenUrl
        };
        //console.log('Formatted product:', formattedProduct);
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
                            //console.log('Closing modal');
                            setIsEditModalOpen(false);
                            setSelectedProduct(null);
                        }}
                    />
                </div>
            )}
            <FiltroAdmin showNewProduct={true} />
                <main className="product-grid">
                    {loading ? (
                        <p>Cargando productos...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        productos.map((product) => (
                            <div className="product-card" key={product.IdProducto}>
                                <img 
                                    src={product.ImagenUrl || '/images/placeholder.png'} 
                                    alt={product.Nombre} 
                                    className="product-image" 
                                    onError={(e) => {
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
                                    <button 
                                        className="delete-button"
                                        onClick={() => handleDelete(product.IdProducto)}
                                    >
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