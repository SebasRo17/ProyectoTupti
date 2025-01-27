import React,  { useState } from "react";
import './headerAdmin.css';

const HeaderAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
      // Sample data - replace with your actual data source
  const products = [
    { id: 1, name: "Yogur Natural", price: "$2.49", image: "/images/yogur-natural.png" },
    { id: 2, name: "Leche Descremada", price: "$1.20", image: "/images/leche-descremada.png" },
    // ...existing products
  ];
  
    const handleSearch = (e) => {
      const value = e.target.value;
      setSearchTerm(value);
  
      if (value.length > 0) {
        const filteredProducts = productos.filter(product =>
          product.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredProducts);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
  
    const handleSuggestionClick = (suggestion) => {
      setSearchTerm(suggestion);
      setShowSuggestions(false);
    };
  
  return (
    <header className="headerAdmin">

    </header>
  );
};

export default HeaderAdmin;
