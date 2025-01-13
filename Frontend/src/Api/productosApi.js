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
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
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
