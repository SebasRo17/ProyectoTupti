import React, { useState } from "react";
import "./Filtros.css";
import "./responsiveFiltros.css";

const Filtro = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 9999]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const categorias = ["Electrónicos", "Ropa", "Bebidas", "Carnes"];
  const precios = [
    { label: "$0 - $99", range: [0, 99] },
    { label: "$100 - $199", range: [100, 199] },
    { label: "$200 - $500", range: [200, 500] },
    { label: "$500+", range: [500, 9999] },
  ];
  const descuentos = ["0% - 20%", "20% - 40%", "40% - 60%", "60% - 80%"];

  const toggleCategory = (categoria) => {
    const updatedCategories = selectedCategories.includes(categoria)
      ? selectedCategories.filter((cat) => cat !== categoria)
      : [...selectedCategories, categoria];
    setSelectedCategories(updatedCategories);
    onFilterChange({ categories: updatedCategories, priceRange, selectedDiscount });
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
    onFilterChange({ categories: selectedCategories, priceRange: range, selectedDiscount });
  };

  const handleDiscountChange = (discount) => {
    setSelectedDiscount(discount);
    onFilterChange({ categories: selectedCategories, priceRange, selectedDiscount: discount });
  };

  return (
    <div className="filtro-container">
      <h3>FILTRO</h3>

      {/* Precio */}
      <div className="filtro-precios">
        <h4>Precio</h4>
        {precios.map((precio, index) => (
          <div key={index} className="filtro-radio">
            <label>
              <input
                type="radio"
                name="priceRange"
                onChange={() => handlePriceRangeChange(precio.range)}
              />
              {precio.label}
            </label>
          </div>
        ))}
      </div>

      {/* Descuentos */}
      <div className="filtro-descuentos">
        <h4>Descuentos</h4>
        {descuentos.map((descuento, index) => (
          <div key={index} className="filtro-radio">
            <label>
              <input
                type="radio"
                name="discount"
                onChange={() => handleDiscountChange(descuento)}
              />
              {descuento}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filtro;