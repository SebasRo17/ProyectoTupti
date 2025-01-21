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
    const response = await axios.get(`${API_URL}/direcciones/usuario/${userId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener las direcciones:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      error
    });
    throw new Error(error.response?.data?.message || 'Error al obtener las direcciones');
  }
};

export const updateSelectedAddress = async (idDireccion) => {
  try {
    const response = await fetch(`${API_URL}/direcciones/${idDireccion}/seleccionar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Error al seleccionar la dirección');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getSelectedAddress = async (idUsuario) => {
  try {
    const response = await axios.get(`${API_URL}/direcciones/usuario/${idUsuario}/seleccionada`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('No hay una dirección seleccionada. Por favor, seleccione una dirección de envío.');
    }
    console.error('Error al obtener la dirección seleccionada:', error);
    throw new Error('Error al obtener la dirección seleccionada');
  }
};
