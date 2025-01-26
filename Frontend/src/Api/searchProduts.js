import axios from 'axios';
import { API_URL } from '../config/config';

export const searchProducts = async (filters = {}) => {
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
    console.error('Error al buscar productos:', error);
    throw error;
  }
};