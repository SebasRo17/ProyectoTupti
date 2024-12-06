
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCategoryProducts } from "../../Api/cetgoryProductsApi";
import { categoryNames, categoryIcons } from '../../data/categoryData';
import CategoriesBar from '../../Components/categoriesBar/categoriesBar';
import Header from "../../Components/header/header.jsx";
import Footer from "../../Components/footer/footer.jsx";
import "./Categoria.css";
import "./ResponsiveCategoria.css";

function Categoria() {

   const [productos, setProductos] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const { id } = useParams();

   // Preparar los datos de categorías
   const categoryData = categoryNames.map((name, i) => ({
     id: i + 1,
     icon: categoryIcons[name],
     label: name,
   }));

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const data = await getCategoryProducts(id);
            setProductos(data);
         } catch (err) {
            setError(err.message);
         } finally {
            setLoading(false);
         }
      };

      fetchProducts();
   }, [id]);

   if (loading) return <div>Cargando...</div>;
   if (error) return <div>Error: {error}</div>;

   return (
      <div className="categoria-page">
         {/* Incluir CategoriesBar con los datos de categoría */}
         <CategoriesBar categoryData={categoryData} />
         
         <div className="categoria-container">

            <h1 className="categoria-titulo">Productos de la Categoría</h1>
            <div className="productos-grid">
               {productos.map((producto) => (
                  <div key={producto.IdProducto} className="producto-card">
                     <img
                        src={producto.Imagenes?.split(',')[0]}
                        alt={producto.Producto}
                        className="producto-imagen"
                        onError={(e) => {
                           e.target.src = 'URL_IMAGEN_DEFAULT';
                        }}
                     />
                     <div className="producto-info">
                        <h3>{producto.Producto}</h3>
                        <p className="producto-precio">${producto.Precio}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

      </div>
   );
}

export default Categoria;
