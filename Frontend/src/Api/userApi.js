import axios from 'axios';
import { API_URL } from '../config/config';

export const updateUserName = async (userId, name) => {
  const response = await axios.put(`${API_URL}/users/${userId}`, { Nombre: name });
  return response.data;
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/register`, 
      {
        email: userData.email,
        contrasenia: userData.contrasenia,
        nombre: userData.nombre
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      // Lanzar el mensaje específico del backend
      throw new Error(error.response.data.message || 'Error al registrar usuario');
    }
    throw new Error('Error de conexión al servidor');
  }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/${userId}/change-password`,
      {
        currentPassword,
        newPassword
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al cambiar la contraseña');
  }
};

export const getUserInfo = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/users/${userId}/info`
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Usuario no encontrado');
    }
    throw new Error(error.response?.data?.message || 'Error al obtener información del usuario');
  }
};

export const getUsersInfo = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/users/info`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener información de los usuarios');
  }
};

export const deactivateUser = async (userId) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/${userId}`,
      { Activo: false }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al desactivar usuario');
  }
};

export const activateUser = async (userId) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/${userId}`,
      { Activo: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al activar usuario');
  }
};