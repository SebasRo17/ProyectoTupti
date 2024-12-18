import axios from 'axios';
import { API_URL } from '../config/config';

export const addToCart = async (productData) => {
  try {
    console.log('Datos enviados al servidor:', productData); // Agregar console.log para verificar los datos
    const response = await axios.post(`${API_URL}/carrito/agregar-producto`, productData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    throw error;
  }
};
export const getCarritoByUsuario = async (idUsuario) => {
    try {
      const response = await axios.get(`${API_URL}/carrito/${idUsuario}`);
      console.log('Datos del carrito obtenidos:', response.data); // Verifica los datos recibidos
      return response.data;
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      throw error;
    }
  };