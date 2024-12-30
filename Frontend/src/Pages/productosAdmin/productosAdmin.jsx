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
import { productosApi } from '../../Api/productosApi';

const ProductosAdmin = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        console.log(`Editando producto ${productId}`);
        const productToEdit = productos.find(product => product.id === productId);
        setSelectedProduct(productToEdit);
        setIsEditModalOpen(true);
    };

    const handleOpenModal = () => {
        setIsEditModalOpen(true);
        setSelectedProduct({
            id: '',
            name: '',
            details: '',
            price: '',
            image: ''
        });
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
                <header className="productos-header">
                    <div className="search-container">
                        <div className="search-input-container">
                        <input 
                        type="text" 
                        placeholder="Buscar productos..." 
                        className="search-input"
                        value={searchTerm}
                        onChange={handleSearch}
                        onFocus={() => setShowSuggestions(true)}
                        />
                        {showSuggestions && suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map((product) => (
                            <li 
                                key={product.id} 
                                onClick={() => handleSuggestionClick(product)}
                                className="suggestion-item"
                            >
                                <img src={product.image} alt={product.name} className="suggestion-image" />
                                <div className="suggestion-details">
                                <span>{product.name}</span>
                                <span className="suggestion-price">{product.price}</span>
                                </div>
                            </li>
                            ))}
                        </ul>
                        )}
                        <button className="search-button1">Buscar</button>
                        </div>
                        <select className="dropdown">
                            <option>Stock</option>
                            <option>Sin stock</option>
                        </select>
                        <select className="dropdown">
                            <option>Categoría</option>
                            <option>Consolas</option>
                            <option>Electrónicos</option>
                        </select>
                        <button className="filter-button">Filtrar</button>
                    </div>
                    <div className="action-buttons">
                        <button className="export-button">Exportar</button>
                        <Link to="/NuevoProducto">
                        <button className="new-product-button">Nuevo Producto</button>
                        </Link>
                        
                    </div>
                </header>
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
                                        onClick={handleOpenModal}
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