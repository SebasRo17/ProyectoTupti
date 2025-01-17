import React, { useState, useRef, useEffect } from "react";
import "./FiltroCategoria.css";

const FiltroCategoria = () => {
  const [precio, setPrecio] = useState(10);
  const [descuento, setDescuento] = useState(0);
  const precioInputRef = useRef(null);
  const descuentoInputRef = useRef(null);

  const updateRangeBackground = (input, value) => {
    const min = input.min || 0;
    const max = input.max || 100;
    const percentage = ((value - min) / (max - min)) * 100;
    input.style.background = `linear-gradient(to right, #4caf50 ${percentage}%, #ddd ${percentage}%)`;
  };

  useEffect(() => {
    if (precioInputRef.current) {
      updateRangeBackground(precioInputRef.current, precio);
    }
    if (descuentoInputRef.current) {
      updateRangeBackground(descuentoInputRef.current, descuento);
    }
  }, [precio, descuento]);

  const handlePrecioChange = (e) => {
    const value = Number(e.target.value);
    setPrecio(value);
    updateRangeBackground(e.target, value);
  };

  const handleDescuentoChange = (e) => {
    const value = Number(e.target.value);
    setDescuento(value);
    updateRangeBackground(e.target, value);
  };

  const handleFiltrar = (tipo) => {
    if (tipo === "precio") {
      alert(`Filtrando por precio mayor a ${precio}$`);
    } else if (tipo === "descuento") {
      alert(`Filtrando por descuento mayor a ${descuento}%`);
    }
  };

  return (
    <div className="filters-nombre15">
      {/* Filtro por Precio */}
      <div className="filter-container-nombre15">
        <div className="filter-title-nombre15">Filtrar por Precio</div>
        <div className="range-container-nombre15">
          <input
            ref={precioInputRef}
            type="range"
            min="0"
            max="100"
            value={precio}
            onChange={handlePrecioChange}
            className="range-input-nombre15"
          />
          <span>{Number(precio) === 100 ? "100$" : `${precio}$ - 100$`}</span>
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
          <input
            ref={descuentoInputRef}
            type="range"
            min="0"
            max="80"
            value={descuento}
            onChange={handleDescuentoChange}
            className="range-input-nombre15"
          />
          <span>{Number(descuento) === 80 ? "80%" : `${descuento}% - 80%`}</span>
        </div>
        <button
          className="filter-button-nombre15"
          onClick={() => handleFiltrar("descuento")}
        >
          Filtrar
        </button>
      </div>
    </div>
  );
};

export default FiltroCategoria;

