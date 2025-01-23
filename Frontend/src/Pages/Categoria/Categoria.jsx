import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getCategoryProducts } from "../../Api/cetgoryProductsApi";
import { categoryNames, categoryIcons } from '../../data/categoryData';
import CategoriesBar from '../../Components/categoriesBar/categoriesBar';
import Header from "../../Components/header/header.jsx";
import Footer from "../../Components/footer/footer.jsx";
import { createCalificacion, getCalificaciones } from '../../Api/calificacionApi';
import "./Categoria.css";
import "./ResponsiveCategoria.css";
import FiltroCategoria from "../../Components/FiltroCategoria/FiltroCategoria.jsx";
import { addToCart } from '../../Api/carritoApi.js';
import jwtDecode from 'jwt-decode';
import LoadingSpinner from '../../Components/LoadingSpinner/LoadingSpinner';

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
   const [idUsuario, setIdUsuario] = useState(null);
   const { id } = useParams();
   const location = useLocation();
   const [isCartOpen, setIsCartOpen] = useState(false); 
   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
   const [showErrorMessage, setShowErrorMessage] = useState(false);

   const toggleCart = () => {
      setIsCartOpen(!isCartOpen);
   };

   useEffect(() => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        try {
          const payload = jwtDecode(token);
          console.log('Token descifrado:', payload);
    
          // Comprueba dónde está IdUsuario
          const userId = payload?.IdUsuario || payload?.user?.IdUsuario;
    
          if (userId) {
            setIdUsuario(userId);
          } else {
            console.error('IdUsuario no encontrado en el token');
          }
    
          const currentTime = Date.now() / 1000;
          if (payload.exp <= currentTime) {
            localStorage.removeItem('jwtToken'); // Elimina token expirado
          }
        } catch (error) {
          console.error('Error decodificando el token:', error);
          localStorage.removeItem('jwtToken'); // Limpia token corrupto
        }
      }
    }, []);
   // Preparar los datos de categorías
   const categoryData = categoryNames.map((name, i) => ({
     id: i + 1,
     icon: categoryIcons[name],
     label: name,
   })); 

   // Función para manejar imágenes de manera uniforme
   const procesarImagenes = (producto) => {
      // Si las imágenes son un string separado por comas
      if (typeof producto.Imagenes === 'string') {
         return producto.Imagenes.split(',');
      }
      
      // Si es un array de objetos de imagen
      if (Array.isArray(producto.Imagenes)) {
         return producto.Imagenes.map(img => 
            img.ImagenUrl || img.imagen || 'URL_IMAGEN_DEFAULT'
         );
      }
      
      // Si no hay imágenes
      return ['URL_IMAGEN_DEFAULT'];
   };

   useEffect(() => {
      const fetchProducts = async () => {
         try {
             // Revisar si hay productos filtrados en el estado de location
             const filteredProducts = location.state?.products || [];
             console.log('Productos filtrados:', filteredProducts);
            
             if (filteredProducts.length > 0) {
                // Si hay productos filtrados, usarlos
                setProductos(filteredProducts);
             } else if (id && id !== "0") {
                // Si no hay productos filtrados, buscar por categoría
                const data = await getCategoryProducts(id);
                console.log('Productos recibidos:', data);
                setProductos(data);
             } else {
                setError("No se encontraron productos");
             }
         } catch (err) {
            setError(err.message);
         } finally {
            setLoading(false);
         }
      };

      fetchProducts();
   }, [id, location.state]);

   useEffect(() => {
      if (selectedProduct) {
         cargarReseñas();
         setCantidad(1); // Restablecer la cantidad a 1 cuando se selecciona un nuevo producto
      }
   }, [selectedProduct]);

   const cargarReseñas = async () => {
      try {
         console.log('Cargando reseñas para producto:', selectedProduct.IdProducto);
         const data = await getCalificaciones(selectedProduct.IdProducto);
         console.log('Reseñas recibidas:', data);
         setReseñas(data || []);
      } catch (error) {
         console.error('Error al cargar reseñas:', error);
         setReseñas([]); 
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
   
   const handleAgregarCarrito = async () => {
      try {
        if (!idUsuario) {
          setShowErrorMessage(true);
          setTimeout(() => setShowErrorMessage(false), 3000);
          return;
        }
    
        const productData = {
          idUsuario: idUsuario,
          idProducto: selectedProduct.IdProducto,
          cantidad: cantidad
        };
    
        const result = await addToCart(productData);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        setShowErrorMessage(true);
        setTimeout(() => setShowErrorMessage(false), 3000);
      }
    };
  
   const handleEnviarResena = async () => {
      setReseñaError('');
      setMensajeExito('');
      
      if (!calificacion) {
         setReseñaError('Debes seleccionar una calificación');
         return;
      }

      try {
         await createCalificacion({
            idProducto: selectedProduct.IdProducto,
            idUsuario: 1,
            comentario: resena.trim() || null,
            puntuacion: calificacion
         });
         
         await cargarReseñas();
         setCalificacion(0);
         setResena('');
         setMensajeExito('¡Reseña enviada exitosamente!');
         
         setTimeout(() => {
            setMensajeExito('');
         }, 3000);
      } catch (error) {
         setReseñaError(error.message);
      }
   };

   if (loading) return <LoadingSpinner />;
   if (error) return <div>Error: {error}</div>;

   return (
      <div className="categoria-page">
         {showSuccessMessage && (
            <div className="success-message">
               Producto agregado exitosamente al carrito
            </div>
         )}
         {showErrorMessage && (
        <div className="alert-message error">
          Debes iniciar sesión para agregar productos al carrito
        </div>
      )}

         <Header 
            toggleCart={toggleCart} 
            isCartOpen={isCartOpen}
         />
         {/* Filtro de Categoría fijo */}
      <div className="filtro-container16">
         <FiltroCategoria />
      </div>
         <CategoriesBar categoryData={categoryData} />
         <div className="categoria-container">

            <div className="productos-grid">
               {productos.map((producto) => {
                  // Procesar imágenes de manera uniforme
                  const imagenes = procesarImagenes(producto);
                  const primeraImagen = imagenes[0] || 'URL_IMAGEN_DEFAULT';

                  return (
                     <div 
                        key={producto.IdProducto} 
                        className="producto-card"
                        onClick={() => handleProductClick(producto)}
                     >
                           {producto.descuento && producto.descuento.porcentaje !== 0 && (
                              <div className="discount-badge">
                                   <span>-{producto.descuento.porcentaje}%</span>
                              </div>
                           )}
                        <img
                           src={primeraImagen}
                           alt={producto.Nombre || producto.Producto}
                           className="producto-imagen"
                           onError={(e) => {
                              e.target.src = 'URL_IMAGEN_DEFAULT';
                           }}
                        />
                        <div className="producto-info">
                        <h3>{producto.Nombre || producto.Producto}</h3>
                           {producto.descuento && producto.descuento.porcentaje !== 0 ? (
                              <>
                                    <p className="producto-precio-original">${producto.Precio}</p>
                                    <p className="producto-precio-descuento">
                                       ${producto.descuento.precioConDescuento}
                                    </p>
                              </>
                           ) : (
                              <p className="producto-precio">${producto.Precio}</p>
                           )}
                        </div>
                        
                     </div>
                  );
               })}
            </div>
         </div>

         {selectedProduct && (
            <div className="modal-overlay4" onClick={closeModal}>
               <div className="modal-content4" onClick={e => e.stopPropagation()}>
                  <button className="modal-close" onClick={closeModal}>&times;</button>
                  <div className="modal-product">
                     <div className="modal-images">
                        {procesarImagenes(selectedProduct).map((imagen, index) => (
                           <img 
                              key={index}
                              src={imagen}
                              alt={`${selectedProduct.Nombre || selectedProduct.Producto} - imagen ${index + 1}`}
                              className="modal-image"
                              onError={(e) => {
                                 e.target.src = 'URL_IMAGEN_DEFAULT';
                              }}
                           />
                        ))}
                     </div>
                     <div className="modal-info8">
                        <h2>{selectedProduct.Nombre || selectedProduct.Producto}</h2>
                        <p className="modal-precio">${selectedProduct.Precio}</p>
                        <p className="modal-descripcion">{selectedProduct.Descripcion}</p>
                        
                        <div className="cantidad-container">
                           <label htmlFor="cantidad">Cantidad:</label>
                           <input 
                              type="number" 
                              id="cantidad" 
                              min="1" 
                              max="99"
                              value={cantidad} // Usar el estado cantidad como valor
                              className="cantidad-input"
                              onChange={handleCantidadChange}
                           />
                        </div>
                        
                        <button className="btn-agregar-carrito" onClick={handleAgregarCarrito}>
                           Agregar al Carrito
                        </button>

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

          <Footer />

      </div>
   );
}

export default Categoria;