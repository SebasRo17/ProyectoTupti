import React, { useState, useEffect } from "react";
import "./FiltroCategoria.css";
import "./FiltroCategoriaResponsive.css";

const FiltroCategoria = () => {
  const [precio, setPrecio] = useState([10, 100]);
  const [descuento, setDescuento] = useState([0, 80]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú hamburguesa

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

    // Asegurarse de que el mínimo no supere al máximo y viceversa
    if (index === 0 && value > newValues[1]) newValues[1] = value;
    if (index === 1 && value < newValues[0]) newValues[0] = value;

    tipo === "precio" ? setPrecio(newValues) : setDescuento(newValues);
  };

  const handleFiltrar = (tipo) => {
    if (tipo === "precio") {
      alert(`Filtrando por precio entre ${precio[0]}$ y ${precio[1]}$`);
    } else if (tipo === "descuento") {
      alert(
        `Filtrando por descuento entre ${descuento[0]}% y ${descuento[1]}%`
      );
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

  const handleFiltrarCategorias = () => {
    if (categoriasSeleccionadas.length === 0) {
      alert("Por favor selecciona al menos una categoría.");
    } else {
      alert(`Filtrando por categorías: ${categoriasSeleccionadas.join(", ")}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <>
      {/* Botón Menú Hamburguesa */}
      <button className="filter-hamburger" onClick={toggleMenu}>
        ☰
      </button>

      {/* Filtro (Menú deslizable) */}
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
                value={precio[0]}
                onChange={(e) => handleRangeChange(e, "precio", 0)}
                className="range-input-nombre15"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={precio[1]}
                onChange={(e) => handleRangeChange(e, "precio", 1)}
                className="range-input-nombre15"
              />
            </div>
            <span>
              {precio[0]}$ - {precio[1]}$
            </span>
          </div>
          <button
            className="filter-button-nombre15"
            onClick={() => handleFiltrar("precio")}
          >
            Filtrar
          </button>
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
          <button
            className="filter-button-nombre15"
            onClick={() => handleFiltrar("descuento")}
          >
            Filtrar
          </button>
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
            <option value="carnes">Carnes</option>
            <option value="vegetales">Vegetales</option>
            <option value="frutas">Frutas</option>
            <option value="bebidas">Bebidas</option>
            <option value="lacteos">Lácteos</option>
            <option value="panaderia">Panadería</option>
            <option value="snacks">Snacks</option>
            <option value="limpieza">Limpieza</option>
            <option value="congelados">Congelados</option>
            <option value="granos">Granos</option>
            <option value="condimentos">Condimentos</option>
            <option value="cuidado">Cuidado</option>
            <option value="mascotas">Mascotas</option>
            <option value="electronica">Electrónica</option>
            <option value="dulces">Dulces</option>
            <option value="enlatados">Enlatados</option>
            <option value="pastas">Pastas</option>
            <option value="aceites">Aceites</option>
            <option value="licor">Licor</option>
          </select>
          <button
            className="filter-button-nombre15"
            onClick={handleFiltrarCategorias}
            disabled={categoriasSeleccionadas.length === 0}
          >
            Filtrar por Categoría
          </button>
        </div>
      </div>
    </>
  );
};

export default FiltroCategoria;
