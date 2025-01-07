import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const resetApi = {
  // Solicitar el reset de contraseña
  requestPasswordReset: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al solicitar el reset de contraseña' };
    }
  },

  // Resetear la contraseña con el token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al restablecer la contraseña' };
    }
  }
};
