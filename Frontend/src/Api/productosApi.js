import axios from 'axios';
import { API_URL } from '../config/config';

export const productosApi = {
    getAllProducts: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (filters.Nombre) queryParams.append('Nombre', filters.Nombre);
            if (filters.PrecioMin) queryParams.append('PrecioMin', filters.PrecioMin);
            if (filters.PrecioMax) queryParams.append('PrecioMax', filters.PrecioMax);
            if (filters.IdTipoProducto) queryParams.append('IdTipoProducto', filters.IdTipoProducto);

            const response = await axios.get(`${API_URL}/products?${queryParams}`);
            
            const formattedData = response.data.map(product => ({
                ...product,
                ImagenUrl: product.Imagenes && product.Imagenes.length > 0 
                    ? product.Imagenes[0].ImagenUrl 
                    : null,
                imagenesArray: product.Imagenes || []
            }));

            return formattedData;
        } catch (error) {
            throw error;
        }
    },

    deleteProduct: async (productId) => {
        try {
            const response = await axios.delete(`${API_URL}/products/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    updateProduct: async (productId, productData) => {
        try {
            const response = await axios.put(`${API_URL}/products/${productId}`, productData);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }
};

export const getProductDetails = async (idProducto) => {
 try {
   const response = await fetch(`${API_URL}/product-details/${idProducto}`);
   
   if (!response.ok) {
     if (response.status === 404) {
       throw new Error('Producto no encontrado');
     }
     throw new Error(`Error ${response.status}: ${response.statusText}`);
   }
   
   return await response.json();
 } catch (error) {
   console.error('Error al obtener detalles del producto:', error);
   throw error;
 }
};