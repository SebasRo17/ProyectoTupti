import { API_URL } from '../config/config';

export const getDescuentoCarrito = async (idCarrito) => {
  try {
    const response = await fetch(`${API_URL}/descuentos/carrito/${idCarrito}`);
    if (!response.ok) {
      if (response.status === 404) {
        return { descuentoTotal: 0, detallesConDescuento: [] };
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener descuentos:', error);
    return { descuentoTotal: 0, detallesConDescuento: [] };
  }
};