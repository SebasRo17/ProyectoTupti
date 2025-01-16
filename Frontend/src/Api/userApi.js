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
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al registrar usuario');
  }
};