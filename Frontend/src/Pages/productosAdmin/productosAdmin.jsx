import React ,  { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx';
import EditarProductos from '../../Components/editarProductos/editarProductos.jsx'
import './productosAdmin.css';
import Filtros from "../../Components/Filtros/Filtros.jsx";
import './responsiveproductosAdmin.css';
import NuevoProducto from "../nuevoProductoAdmin/nuevoProductoAdmin.jsx";


const ProductosAdmin = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);


    const productos = [
        { id: 1, name: "Yogur Natural", details: "Yogur de soya", price: "$2.49", image: "/images/yogur-natural.png" },
        { id: 2, name: "Leche Descremada", details: "Leche de 1% de grasa", price: "$1.20", image: "/images/leche-descremada.png" },
        { id: 3, name: "Yogur de Sabores", details: "Yogur de frutas", price: "$1.50", image: "/images/yogur-sabores.png" },
        { id: 4, name: "Queso Fresco", details: "Queso de 200g", price: "$3.50", image: "/images/queso-fresco.png" },
        { id: 5, name: "Mantequilla", details: "Mantequilla de 200g", price: "$2.59", image: "/images/mantequilla.png" },
    ];


    const handleDelete = (productId) => {
        // Implementar lógica de eliminación
        console.log(`Eliminando producto ${productId}`);
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
                    {productos.map((product) => (
                        <div className="product-card" key={product.id}>
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="product-image" 
                                onError={(e) => {
                                    e.target.src = '/images/placeholder.png'; // Imagen de respaldo
                                }}
                            />
                            <h3 className="product-title">{product.name}</h3>
                            <p className="product-details">{product.details}</p>
                            <p className="product-price">{product.price}</p>
                            <div className="card-buttons">
                                <button 
                                    className="editar-button"
                                    onClick={handleOpenModal}
                                >
                                    Editar
                                </button>
                                {isEditModalOpen && (
                                    <EditarProductos 
                                        onClose={handleCloseModal}
                                        productos={productos}
                                    />
                                )}
                                <button 
                                    className="delete-button"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </main>
               {/* <div className="filters-container">
                    <div className="filtros-clase">
                <Filtros />
            </div>
        </div> */}
        </div>
    </div>
    );
};

export default ProductosAdmin;