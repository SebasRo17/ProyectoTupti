import axios from 'axios';
import { API_URL } from '../config/config';

export const getProtectedData = async () => {
  const token = localStorage.getItem('jwtToken');
  try {
    const response = await axios.get(`${API_URL}/protected-route`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};