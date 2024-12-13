import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../Components/headerAdmin/headerAdmin.jsx';
import BarraLateralAdmin from '../../Components/barraLateralAdmin/barraLateralAdmin.jsx';
import './productosAdmin.css';
import Filtros from "../../Components/Filtros/Filtros.jsx";

const ProductosAdmin = () => {
    const navigate = useNavigate();

    const productos = [
        { id: 1, name: "Yogur Natural", details: "Yogur de soya", price: "$2.49", image: "/images/yogur-natural.png" },
        { id: 2, name: "Leche Descremada", details: "Leche de 1% de grasa", price: "$1.20", image: "/images/leche-descremada.png" },
        { id: 3, name: "Yogur de Sabores", details: "Yogur de frutas", price: "$1.50", image: "/images/yogur-sabores.png" },
        { id: 4, name: "Queso Fresco", details: "Queso de 200g", price: "$3.50", image: "/images/queso-fresco.png" },
        { id: 5, name: "Mantequilla", details: "Mantequilla de 200g", price: "$2.59", image: "/images/mantequilla.png" },
    ];

    const handleEdit = (productId) => {
        // Implementar lógica de edición
        console.log(`Editando producto ${productId}`);
    };

    const handleDelete = (productId) => {
        // Implementar lógica de eliminación
        console.log(`Eliminando producto ${productId}`);
    };

    return (
        <div className="PantallaProductos">
            <HeaderAdmin />
            <BarraLateralAdmin />
            <div className="productos-container">
            <h1>Productos</h1>
            <header className="header">
                
                <div className="search-container">
                <input type="text" placeholder="Búsqueda Avanzada" className="search-input" />
                <button className="search-button">Buscar</button>
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
                <button className="new-product-button">Nuevo Producto</button>
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
                                    className="edit-button" 
                                    onClick={() => handleEdit(product.id)}
                                >
                                    Editar
                                </button>
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
                <Filtros />
                //aqui debo de poner el codigo para qe se vea al lado derecho
            </div>
        </div>
    );
};

export default ProductosAdmin;