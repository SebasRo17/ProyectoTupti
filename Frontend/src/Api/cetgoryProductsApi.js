const API_URL = 'http://localhost:3000/api';

export const getCategoryProducts = async (categoryId) => {
  try {
    const response = await fetch(`${API_URL}/cProducts/${categoryId}`);
    if (!response.ok) {
      throw new Error('Error al obtener los productos de la categoría');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
