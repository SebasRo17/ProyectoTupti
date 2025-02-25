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

export const getAllPedidosWithBasicInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/pedidos/list/basic`);
    console.log('Lista básica de pedidos obtenida:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la lista básica de pedidos:', error);
    throw error;
  }
};

export const getPedidoFullDetails = async (idPedido) => {
  try {
    const response = await axios.get(`${API_URL}/pedidos/${idPedido}/complete`);
    console.log('Detalles completos del pedido obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalles completos del pedido:', error);
    throw error;
  }
};

export const getPedidosForExport = async (estado, startDate, endDate) => {
  try {
    // Primero obtener la lista básica de pedidos
    const pedidosBasicos = await getAllPedidosWithBasicInfo();
    
    // Filtrar por estado y rango de fechas
    const pedidosFiltrados = pedidosBasicos.filter(pedido => {
      const pedidoDate = new Date(pedido.fechaActualizacion);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return (estado === 'todos' || getStatusNumber(pedido.estado) === getStatusNumber(estado)) &&
             pedidoDate >= start && 
             pedidoDate <= end;
    });

    // Obtener detalles completos para cada pedido filtrado
    const pedidosCompletos = await Promise.all(
      pedidosFiltrados.map(pedido => getPedidoFullDetails(pedido.idPedido))
    );

    return pedidosCompletos;
  } catch (error) {
    console.error('Error al obtener pedidos para exportar:', error);
    throw error;
  }
};

const getStatusNumber = (status) => {
  const statusMap = {
    'espera': 0,
    'reembolsada': 1,
    'entregada': 2
  };
  return typeof status === 'number' ? status : statusMap[status];
};
