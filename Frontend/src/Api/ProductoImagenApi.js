import axios from 'axios';
import { API_URL } from '../config/config';

export const productoImagenApi = {
  createProductoImagen: async (imagenData) => {
    try {
      const response = await axios.post(`${API_URL}/producto-imagen`, imagenData);
      return response.data;
    } catch (error) {
      console.error('Error al crear ProductoImagen:', error);
      throw error;
    }
  }
};