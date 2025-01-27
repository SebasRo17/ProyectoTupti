import axios from 'axios';
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

export const getAllDiscounts = async () => {
  try {
    const response = await fetch(`${API_URL}/descuentos`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener lista de descuentos:', error);
    return [];
  }
};

export const updateDiscount = async (idDescuento, discountData) => {
  try {
    const response = await fetch(`${API_URL}/descuentos/${idDescuento}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discountData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error details:', errorData);
      throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al actualizar descuento:', error);
    throw error;
  }
};

export const createDescuento = async (descuentoData) => {
  try {
    const response = await axios.post(`${API_URL}/descuentos`, descuentoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteDiscount = async (idDescuento) => {
  try {
    const response = await fetch(`${API_URL}/descuentos/${idDescuento}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error details:', errorData);
      throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al eliminar descuento:', error);
    throw error;
  }
};