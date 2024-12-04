// src/Api/bestSellApi.js
import axios from 'axios';
import { API_BASE } from '../config/config';

export const getBestSellers = async () => {
  try {
    const response = await axios.get(`${API_BASE}/best-sellers`, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      throw new Error('No se pudo conectar con el servidor. Verifica que el servidor esté corriendo.');
    }
    console.error('Error en la petición:', error);
    throw error;
  }
};