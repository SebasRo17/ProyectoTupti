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
   const [selectedProduct, setSelectedProduct] = useState(null);
   const [cantidad, setCantidad] = useState(1);
   const [calificacion, setCalificacion] = useState(0);
   const [resena, setResena] = useState('');
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

   const handleProductClick = (producto) => {
      setSelectedProduct(producto);
   };

   const closeModal = () => {
      setSelectedProduct(null);
   };

   const handleCantidadChange = (e) => {
      setCantidad(parseInt(e.target.value));
   };
   
   const handleCalificacionClick = (valor) => {
      setCalificacion(valor);
   };
   
   const handleAgregarCarrito = () => {
      // Aquí va la lógica para agregar al carrito
      console.log('Agregando al carrito:', {
         producto: selectedProduct,
         cantidad: cantidad
      });
   };
   
   const handleEnviarResena = () => {
      // Aquí va la lógica para enviar la reseña
      console.log('Enviando reseña:', {
         producto: selectedProduct.IdProducto,
         calificacion: calificacion,
         resena: resena
      });
   };

   if (loading) return <div>Cargando...</div>;
   if (error) return <div>Error: {error}</div>;

   return (
      <div className="categoria-page">
         <Header />
         <CategoriesBar categoryData={categoryData} />
         <div className="categoria-container">
            <h1 className="categoria-titulo">Productos de la Categoría</h1>
            <div className="productos-grid">
               {productos.map((producto) => {
                  // Asegurarnos de que Imagenes sea un array
                  const imagenes = producto.Imagenes ? producto.Imagenes.split(',') : [];
                  const primeraImagen = imagenes[0] || 'URL_IMAGEN_DEFAULT';

                  return (
                     <div 
                        key={producto.IdProducto} 
                        className="producto-card"
                        onClick={() => handleProductClick(producto)}
                     >
                        <img
                           src={primeraImagen}
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
                  );
               })}
            </div>
         </div>

         {selectedProduct && (
            <div className="modal-overlay" onClick={closeModal}>
               <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <button className="modal-close" onClick={closeModal}>&times;</button>
                  <div className="modal-product">
                     <div className="modal-images">
                        {selectedProduct.Imagenes.split(',').map((imagen, index) => (
                           <img 
                              key={index}
                              src={imagen}
                              alt={`${selectedProduct.Producto} - imagen ${index + 1}`}
                              className="modal-image"
                           />
                        ))}
                     </div>
                     <div className="modal-info">
                        <h2>{selectedProduct.Nombre}</h2>
                        <p className="modal-precio">${selectedProduct.Precio}</p>
                        <p className="modal-descripcion">{selectedProduct.Descripcion}</p>
                        
                        {/* Selector de cantidad y botón de carrito */}
                        <div className="cantidad-container">
                           <label htmlFor="cantidad">Cantidad:</label>
                           <input 
                              type="number" 
                              id="cantidad" 
                              min="1" 
                              max="99"
                              defaultValue="1"
                              className="cantidad-input"
                              onChange={handleCantidadChange}
                           />
                        </div>
                        
                        <button className="btn-agregar-carrito" onClick={handleAgregarCarrito}>
                           Agregar al Carrito
                        </button>

                        {/* Sección de reseñas */}
                        <div className="resenas-container">
                           <h3>Deja tu reseña</h3>
                           <div className="estrellas-container">
                              {[1,2,3,4,5].map((estrella) => (
                                 <span 
                                    key={estrella} 
                                    className="estrella"
                                    role="button"
                                    onClick={() => handleCalificacionClick(estrella)}
                                 >
                                    ★
                                 </span>
                              ))}
                           </div>
                           <textarea 
                              className="resena-input"
                              placeholder="Escribe tu reseña aquí..."
                              rows="4"
                              value={resena}
                              onChange={(e) => setResena(e.target.value)}
                           />
                           <button className="btn-enviar-resena" onClick={handleEnviarResena}>
                              Enviar Reseña
                           </button>
                        </div>
                        
                        <p className="modal-id">ID: {selectedProduct.IdProducto}</p>
                     </div>
                  </div>
               </div>
            </div>
         )}

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
