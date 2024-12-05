import React from "react";
import Header from '../../Components/header/header.jsx'; 
import CategoriesBar from '../../Components/categoriesBar/categoriesBar.jsx';
import Footer from '../../Components/footer/footer.jsx'; 
import "./Categoria.css";

function Categoria() {
   // Simulación de productos, puedes reemplazarlo con datos reales desde un backend
   const productos = [
      { id: 1, nombre: "Producto 1", imagen: "url_de_imagen" },
      { id: 2, nombre: "Producto 2", imagen: "url_de_imagen" },
      { id: 3, nombre: "Producto 3", imagen: "url_de_imagen" },
      { id: 4, nombre: "Producto 4", imagen: "url_de_imagen" },
      { id: 5, nombre: "Producto 5", imagen: "url_de_imagen" },
      { id: 6, nombre: "Producto 6", imagen: "url_de_imagen" },
      // Agrega más productos según necesites
   ];

   return (
      <div>
         <Header />  
         <CategoriesBar /> 

         {/* Contenedor principal de la pantalla */}
         <div className="categoria-container">
            <h1 className="categoria-titulo">Productos</h1>
            {/* Contenedor de la lista de productos */}
            <div className="productos-grid">
               {productos.map((producto) => (
                  <div key={producto.id} className="producto-card">
                     <img
                        src={producto.imagen || "placeholder_de_imagen"}
                        alt={producto.nombre}
                        className="producto-imagen"
                     />
                     <p className="producto-nombre">{producto.nombre}</p>
                  </div>
               ))}
            </div>
         </div>
      <div className="filter">
        <h3>Filtro de Busqueda </h3>
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
