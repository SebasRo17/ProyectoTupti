import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCategoryProducts } from "../../Api/cetgoryProductsApi";
import { categoryNames, categoryIcons } from '../../data/categoryData';
import CategoriesBar from '../../Components/categoriesBar/categoriesBar';
import Header from "../../Components/header/header.jsx";
import Footer from "../../Components/footer/footer.jsx";
import { createCalificacion, getCalificaciones } from '../../Api/calificacionApi';
import "./Categoria.css";
import "./ResponsiveCategoria.css";
import Filtros from "../../Components/Filtros/Filtros.jsx";



function Categoria() {
   const [productos, setProductos] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [selectedProduct, setSelectedProduct] = useState(null);
   const [cantidad, setCantidad] = useState(1);
   const [calificacion, setCalificacion] = useState(0);
   const [resena, setResena] = useState('');
   const [reseñaError, setReseñaError] = useState('');
   const [reseñas, setReseñas] = useState([]);
   const [mensajeExito, setMensajeExito] = useState('');
   const { id } = useParams();
   const [isCartOpen, setIsCartOpen] = useState(false); 

   const toggleCart = () => {
      setIsCartOpen(!isCartOpen);
   };

   // Preparar los datos de categorías
   const categoryData = categoryNames.map((name, i) => ({
     id: i + 1, // Ya está correcto, empieza desde 1
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

   useEffect(() => {
      if (selectedProduct) {
         cargarReseñas();
      }
   }, [selectedProduct]);

   const cargarReseñas = async () => {
      try {
         console.log('Cargando reseñas para producto:', selectedProduct.IdProducto); // Debug
         const data = await getCalificaciones(selectedProduct.IdProducto);
         console.log('Reseñas recibidas:', data); // Debug
         setReseñas(data || []);
      } catch (error) {
         console.error('Error al cargar reseñas:', error);
         setReseñas([]); // En caso de error, establecer un array vacío
      }
   };

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
   
   const handleEnviarResena = async () => {
      setReseñaError('');
      setMensajeExito(''); // Limpiar mensaje de éxito anterior
      
      if (!calificacion) {
         setReseñaError('Debes seleccionar una calificación');
         return;
      }

      try {
         await createCalificacion({
            idProducto: selectedProduct.IdProducto,
            idUsuario: 1, // Aquí deberías usar el ID del usuario actual
            comentario: resena.trim() || null,
            puntuacion: calificacion
         });
         
         await cargarReseñas();
         setCalificacion(0);
         setResena('');
         setMensajeExito('¡Reseña enviada exitosamente!');
         
         // Ocultar el mensaje de éxito después de 3 segundos
         setTimeout(() => {
            setMensajeExito('');
         }, 3000);
      } catch (error) {
         setReseñaError(error.message);
      }
   };

   if (loading) return <div>Cargando...</div>;
   if (error) return <div>Error: {error}</div>;

   return (
      <div className="categoria-page">
         <Header 
        toggleCart={toggleCart} 
        isCartOpen={isCartOpen}
      />
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
                           {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}
                           <div className="estrellas-container">
                              {[1,2,3,4,5].map((estrella) => (
                                 <span 
                                    key={`rating-${estrella}`}
                                    className={`estrella ${estrella <= calificacion ? 'activa' : ''}`}
                                    onClick={() => handleCalificacionClick(estrella)}
                                 >
                                    ★
                                 </span>
                              ))}
                           </div>
                           <form onSubmit={(e) => {
                              e.preventDefault();
                              handleEnviarResena();
                           }} className="resena-form">
                              <textarea 
                                 className="resena-input"
                                 placeholder="Escribe tu reseña aquí (opcional)..."
                                 rows="4"
                                 value={resena}
                                 onChange={(e) => setResena(e.target.value)}
                              />
                              {reseñaError && <p className="error-message">{reseñaError}</p>}
                              <button type="submit" className="btn-enviar-resena">
                                 Enviar Reseña
                              </button>
                           </form>

                           {/* Sección única de reseñas */}
                           <div className="resenas-seccion">
                              <h3>Reseñas del Producto</h3>
                              {reseñas.length > 0 ? (
                                 <div className="resenas-lista">
                                    {reseñas.map((reseña) => (
                                       <div key={`review-${reseña.IdCalificacion}`} className="resena-card">
                                          <div className="resena-header">
                                             <div className="usuario-info">
                                                <strong>{reseña.NombreUsuario}</strong>
                                                <span className="fecha-resena">
                                                   {new Date(reseña.FechaReseña).toLocaleDateString()}
                                                </span>
                                             </div>
                                             <div className="puntuacion">
                                                {[...Array(5)].map((_, index) => (
                                                   <span 
                                                      key={`star-${reseña.IdCalificacion}-${index}`} 
                                                      className={`estrella ${index < reseña.Puntuacion ? 'activa' : ''}`}
                                                   >
                                                      ★
                                                   </span>
                                                ))}
                                             </div>
                                          </div>
                                          {reseña.Comentario && (
                                             <p className="resena-comentario">{reseña.Comentario}</p>
                                          )}
                                       </div>
                                    ))}
                                 </div>
                              ) : (
                                 <p className="no-resenas">No hay reseñas para este producto aún.</p>
                              )}
                           </div>
                        </div>
                        
                        <p className="modal-id">ID: {selectedProduct.IdProducto}</p>
                        
                     </div>
                  </div>
               </div>
            </div>
         )}


          {/* Aquí va el componente de Footer */}
          <Footer />
          <Filtros /> 

      </div>
   );
}

export default Categoria;
