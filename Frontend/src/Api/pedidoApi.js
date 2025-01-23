import axios from 'axios';
import { API_URL } from '../config/config';

export const getPedidoByCarrito = async (idCarrito) => {
  try {
    const response = await axios.get(`${API_URL}/pedidos/carrito/${idCarrito}`);
    console.log('Datos del pedido obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el pedido:', error);
    throw error;
  }
  
};
export const getDetallesPedido = async (idPedido) => {
    try {
      const response = await axios.get(`${API_URL}/pedidos/${idPedido}/detalles`);
      console.log('Detalles del pedido obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los detalles del pedido:', error);
      throw error;
    }
  };
  export const createPedido = async (pedidoData) => {
    try {
      const response = await axios.post(`${API_URL}/pedidos`, pedidoData);
      console.log('Pedido creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      throw error;
    }
  };

export const getLastPedidoByUserId = async (idUsuario) => {
  try {
    const response = await axios.get(`${API_URL}/pedidos/usuario/${idUsuario}/ultimo`);
    console.log('Último pedido del usuario obtenido:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el último pedido del usuario:', error);
    throw error;
  }
};
