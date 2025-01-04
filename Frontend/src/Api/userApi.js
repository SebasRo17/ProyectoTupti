import axios from 'axios';

export const updateUserName = async (userId, name) => {
  const response = await axios.put(`${import.meta.env.VITE_API_URL}/users/${userId}`, { Nombre: name });
  return response.data;
};
