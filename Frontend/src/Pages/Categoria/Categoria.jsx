import React, { useState } from "react";
import Header from "../../Components/header/header.jsx";
import CategoriesBar from "../../Components/categoriesBar/categoriesBar.jsx";
import Footer from "../../Components/footer/footer.jsx";
import "./Categoria.css";
import "./ResponsiveCategoria.css";

function Categoria() {
   // Simulación de productos, incluyendo precios
   const productos = [
      { id: 1, nombre: "Producto 1", imagen: "url_de_imagen", precio: "$10.00" },
      { id: 2, nombre: "Producto 2", imagen: "url_de_imagen", precio: "$15.00" },
      { id: 3, nombre: "Producto 3", imagen: "url_de_imagen", precio: "$20.00" },
      { id: 4, nombre: "Producto 4", imagen: "url_de_imagen", precio: "$25.00" },
      { id: 5, nombre: "Producto 5", imagen: "url_de_imagen", precio: "$30.00" },
      { id: 6, nombre: "Producto 6", imagen: "url_de_imagen", precio: "$35.00" },
   ];

   // Estado para controlar la posición actual del carrusel
   const [posicion, setPosicion] = useState(0);
   const productosPorPagina = 3; // Número de productos visibles a la vez

   // Manejadores de desplazamiento
   const moverIzquierda = () => {
      setPosicion((prev) => Math.max(prev - 1, 0));
   };

   const moverDerecha = () => {
      setPosicion((prev) => Math.min(prev + 1, productos.length - productosPorPagina));
   };

   // Calcular productos visibles
   const productosVisibles = productos.slice(posicion, posicion + productosPorPagina);

   return (
      <div>
         <Header />
         <CategoriesBar />

         {/* Contenedor principal de la pantalla */}
         <div className="categoria-container">
            <h1 className="categoria-titulo">Productos</h1>

            {/* Carrusel de productos */}
            <div className="carrusel">
               <button onClick={moverIzquierda} className="carrusel-boton">
                  &lt;
               </button>
               <div className="productos-carrusel">
                  {productosVisibles.map((producto) => (
                     <div key={producto.id} className="producto-card">
                        <img
                           src={producto.imagen || "placeholder_de_imagen"}
                           alt={producto.nombre}
                           className="producto-imagen"
                        />
                        <p className="producto-nombre">{producto.nombre}</p>
                        <p className="producto-precio">{producto.precio}</p>
                     </div>
                  ))}
               </div>
               <button onClick={moverDerecha} className="carrusel-boton">
                  &gt;
               </button>
            </div>
         </div>

         <div className="filter">
            <h3>Filtro de Búsqueda</h3>
            <div className="filtro-busqueda">
               <a href="#">Cupones</a>
               <a href="#">Promociones</a>
            </div>
         </div>
         <Footer />
      </div>
   );
}

export default Categoria;
