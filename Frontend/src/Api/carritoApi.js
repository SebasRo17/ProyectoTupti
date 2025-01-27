import axios from 'axios';
import { API_URL } from '../config/config';

export const addToCart = async (productData) => {
  try {
    console.log('Datos enviados al servidor:', productData); // Agregar console.log para verificar los datos
    const response = await axios.post(`${API_URL}/carrito/agregar-producto`, productData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    throw error;
  }
};
export const getCarritoByUsuario = async (idUsuario) => {
    try {
      const response = await axios.get(`${API_URL}/carrito/${idUsuario}`);
      console.log('Datos del carrito obtenidos:', response.data); // Verifica los datos recibidos
      return response.data;
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      throw error;
    }
  };
  export const getTotalesCarrito = async (idCarrito) => {
    try {
      const response = await fetch(`${API_URL}/carrito/${idCarrito}/totales`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener los totales del carrito');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  // carritoApi.js - Agregar este nuevo método
export const actualizarEstadoCarrito = async (idCarrito, estado) => {
  try {
    const response = await fetch(`${API_URL}/carrito/${idCarrito}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
      body: JSON.stringify({ estado })
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el estado del carrito');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const deleteCarritoDetalle = async (id) => {
  try {
    const response = await fetch(`${API_URL}/carrito-detalle/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar el detalle del carrito');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en la API:', error);
    throw error;
  }
};