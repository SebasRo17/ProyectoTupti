import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};
