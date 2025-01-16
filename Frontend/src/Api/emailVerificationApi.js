import axios from 'axios';
import { API_URL } from '../config/config';

export const verifyEmailToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users/verify-email/${token}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error al verificar el email');
  }
};
