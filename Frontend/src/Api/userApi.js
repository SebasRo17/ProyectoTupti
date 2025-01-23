import axios from 'axios';

export const updateUserName = async (userId, name) => {
  const response = await axios.put(`${import.meta.env.VITE_API_URL_DEVELOPMENT}/users/${userId}`, { Nombre: name });
  return response.data;
};
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL_DEVELOPMENT}/users/register`, 
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

export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL_DEVELOPMENT}/users/${userId}/change-password`,
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