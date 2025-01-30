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
export const getProductoImagenesByIdProducto = async (idProducto) => {
    try {
      const response = await axios.get(`${API_URL}/producto-imagen/producto/${idProducto}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener imágenes del producto:', error);
      throw error;
    }
  };
export const  deleteProductoImagen = async (idProductoImagen) => {
    try {
      const response = await axios.delete(`${API_URL}/producto-imagen/${idProductoImagen}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar ProductoImagen:', error);
      throw error;
    }
  };

export const  createProductoImagen = async (imagenData) => {
    try {
      const response = await axios.post(`${API_URL}/producto-imagen`, imagenData);
      return response.data;
    } catch (error) {
      console.error('Error al crear ProductoImagen:', error);
      throw error;
    }
  }