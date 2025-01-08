import axios from 'axios';
import { API_URL } from '../config/config.js';

export const createDireccion = async (direccionData) => {
  try {
    const token = localStorage.getItem('jwtToken'); // Cambiado de 'token' a 'jwtToken'
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('Token a enviar:', token);
    
    const response = await axios.post(`${API_URL}/direcciones`, direccionData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error en createDireccion:', error.response || error);
    throw error.response?.data || error;
  }
};

export const deleteDireccion = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/direcciones/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la dirección:', error);
    throw error;
  }
};

export const getDireccionesByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/direcciones/usuario/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las direcciones:', error);
    throw error;
  }
};

export const updateDireccion = async (id, direccionData) => {
  try {
    const response = await axios.put(`${API_URL}/direcciones/${id}`, direccionData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la dirección:', error);
    throw error;
  }
};
