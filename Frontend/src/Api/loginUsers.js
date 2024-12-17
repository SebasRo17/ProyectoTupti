import axios from 'axios';
import { API_URL } from '../config/config';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email,
      password
    });
    
    // Almacenar datos del usuario según la opción de "mantener sesión"
    const storeData = (data) => {
      const storage = localStorage;
      storage.setItem('user', JSON.stringify(data));
    };

    if (response.data.success) {
      storeData(response.data.user);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};
