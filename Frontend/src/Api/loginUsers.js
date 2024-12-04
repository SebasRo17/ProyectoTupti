import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://proyectotupti.onrender.com'
  : 'http://localhost:10000';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email,
      password
    }, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión con el servidor' };
  }
};
