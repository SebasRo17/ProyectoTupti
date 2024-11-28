// src/Api/bestSellApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export const getBestSellers = async () => {
  try {
    console.log('Iniciando petición a:', `${BASE_URL}/best-sellers`);
    const response = await axios.get(`${BASE_URL}/best-sellers`, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log('Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      console.error('Error de conexión:', error);
      throw new Error('No se pudo conectar con el servidor. Verifica que el servidor esté corriendo.');
    }
    console.error('Error detallado:', error.response || error);
    throw error;
  }
};