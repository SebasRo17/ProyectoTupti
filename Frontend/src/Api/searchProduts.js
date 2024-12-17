import axios from 'axios';
import { API_URL } from '../config/config';

export const searchProducts = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      params: {
        Nombre: searchTerm,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al buscar productos:', error);
    throw error;
  }
};