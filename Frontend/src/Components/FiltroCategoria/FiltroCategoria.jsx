import React, { useState, useEffect } from "react";
import "./FiltroCategoria.css";
import "./FiltroCategoriaResponsive.css";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../../Api/searchProduts";

const FiltroCategoria = () => {
  const [precio, setPrecio] = useState([0, 100]);
  const [descuento, setDescuento] = useState([0, 80]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    updateRangeBackground(precio, "precio-slider", 0, 100);
    updateRangeBackground(descuento, "descuento-slider", 0, 80);
  }, [precio, descuento]);

  const updateRangeBackground = (values, sliderId, min, max) => {
    const slider = document.getElementById(sliderId);
    if (slider) {
      const percentage1 = ((values[0] - min) / (max - min)) * 100;
      const percentage2 = ((values[1] - min) / (max - min)) * 100;
      slider.style.background = `linear-gradient(to right, #ddd ${percentage1}%, #4caf50 ${percentage1}%, #4caf50 ${percentage2}%, #ddd ${percentage2}%)`;
    }
  };

  const handleRangeChange = (e, tipo, index) => {
    const value = Number(e.target.value);
    const newValues = tipo === "precio" ? [...precio] : [...descuento];

    newValues[index] = value;

    if (index === 0 && value > newValues[1]) newValues[1] = value;
    if (index === 1 && value < newValues[0]) newValues[0] = value;

    tipo === "precio" ? setPrecio(newValues) : setDescuento(newValues);
  };

  const handleFiltrar = async () => {
    try {
      // Construct dynamic filter object
      const filterParams = {
        ...(categoriasSeleccionadas.length > 0 && { 
          IdTipoProducto: categoriasSeleccionadas[0] 
        })
      };
  
      const allProducts = await searchProducts(filterParams);
  
      const finalFilteredProducts = allProducts.filter(product => {
        // Category filter (always true if no category selected)
        const categoryMatch = categoriasSeleccionadas.length === 0 || 
          categoriasSeleccionadas.includes(product.IdTipoProducto.toString());
  
        // Price filter (only apply if not at full range)
        const priceMatch = 
          (precio[0] === 0 && precio[1] === 100) || 
          (parseFloat(product.Precio) >= precio[0] && 
           parseFloat(product.Precio) <= precio[1]);
  
        // Discount filter (only apply if not at full range)
        const descuentoProducto = product.descuento 
          ? parseFloat(product.descuento.porcentaje) 
          : 0;
        const discountMatch = 
          (descuento[0] === 0 && descuento[1] === 80) ||
          (descuentoProducto >= descuento[0] && 
           descuentoProducto <= descuento[1]);
  
        return categoryMatch && priceMatch && discountMatch;
      });
  
      if (finalFilteredProducts.length > 0) {
        navigate('/categoria/filtrados', { 
          state: { 
            products: finalFilteredProducts,
            filters: {
              priceRange: { min: precio[0], max: precio[1] },
              discountRange: { min: descuento[0], max: descuento[1] },
              categoryId: categoriasSeleccionadas[0] || null
            }
          } 
        });
        setFilteredProducts(finalFilteredProducts);
      } else {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error al filtrar productos:', error);
    }
  };
  const handleCategoriaChange = (e) => {
    const { options } = e.target;
    const selectedCategories = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedCategories.push(options[i].value);
      }
    }
    setCategoriasSeleccionadas(selectedCategories);
  };

  const clearFilters = () => {
    setPrecio([0, 100]);
    setDescuento([0, 80]);  
    setCategoriasSeleccionadas([]);
    setFilteredProducts([]);
  };
  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <>
      <button className="filter-hamburger" onClick={toggleMenu}>
        ☰
      </button>

      <div className={`filters-nombre15 ${isMenuOpen ? "active" : ""}`}>
        {/* Filtro por Precio */}
        <div className="filter-container-nombre15">
          <div className="filter-title-nombre15">Filtrar por Precio</div>
          <div className="range-container-nombre15">
            <div className="slider-wrapper">
              <input
                id="precio-slider"
                type="range"
                min="0"
                max="100"
                step="0.01"
                value={precio[0]}
                onChange={(e) => handleRangeChange(e, "precio", 0)}
                className="range-input-nombre15"
              />
              <input
                type="range"
                min="0"
                max="100"
                step="0.01"
                value={precio[1]}
                onChange={(e) => handleRangeChange(e, "precio", 1)}
                className="range-input-nombre15"
              />
            </div>
            <span>
              {precio[0]}$ - {precio[1]}$
            </span>
          </div>
        </div>

        {/* Filtro por Descuento */}
        <div className="filter-container-nombre15">
          <div className="filter-title-nombre15">Filtrar por Descuento</div>
          <div className="range-container-nombre15">
            <div className="slider-wrapper">
              <input
                id="descuento-slider"
                type="range"
                min="0"
                max="80"
                value={descuento[0]}
                onChange={(e) => handleRangeChange(e, "descuento", 0)}
                className="range-input-nombre15"
              />
              <input
                type="range"
                min="0"
                max="80"
                value={descuento[1]}
                onChange={(e) => handleRangeChange(e, "descuento", 1)}
                className="range-input-nombre15"
              />
            </div>
            <span>
              {descuento[0]}% - {descuento[1]}%
            </span>
          </div>
        </div>

        {/* Filtro por Categoría */}
        <div className="filter-container-nombre15">
          <div className="filter-title-nombre15">Filtrar por Categoría</div>
          <select
            className="category-select"
            value={categoriasSeleccionadas}
            onChange={handleCategoriaChange}
            multiple
          >
            <option value="1">Carnes</option>
            <option value="2">Vegetales</option>
            <option value="3">Frutas</option>
            <option value="4">Bebidas</option>
            <option value="5">Lácteos</option>
            <option value="6">Panadería</option>
            <option value="7">Snacks</option>
            <option value="8">Limpieza</option>
            <option value="9">Congelados</option>
            <option value="10">Granos</option>
            <option value="11">Condimentos</option>
            <option value="12">Cuidado</option>
            <option value="13">Mascotas</option>
            <option value="14">Electrónica</option>
            <option value="15">Dulces</option>
            <option value="16">Enlatados</option>
            <option value="17">Pastas</option>
            <option value="18">Aceites</option>
            <option value="19">Licor</option>
          </select>
        </div>

        {/* Botones de Filtrado */}
        <div className="filter-buttons-container">
          <button
            className="filter-button-nombre15"
            onClick={handleFiltrar}
            disabled={
              precio[0] === 10 && 
              precio[1] === 100 && 
              descuento[0] === 0 && 
              descuento[1] === 80 && 
              categoriasSeleccionadas.length === 0
            }
          >
            Filtrar
          </button>
          <button
            className="clear-filter-button"
            onClick={clearFilters}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
      {showAlert && (
        <div className="alert-container">
          <div className="alert-message">
            No hay productos que coincidan con los filtros
          </div>
        </div>
      )}
    </>
  );
};

export default FiltroCategoria;