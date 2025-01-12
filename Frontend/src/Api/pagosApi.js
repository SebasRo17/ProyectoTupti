import axios from 'axios';
import { API_URL } from '../config/config';

export const createPaypalOrder = async (idPedido, monto) => {
    try {
      const response = await axios.post(`${API_URL}/api/payments/create`, {
        idPedido,
        monto
      });
      console.log('Orden de PayPal creada:', response.data);
      return response.data; // Esto devuelve { approveUrl, orderId }
    } catch (error) {
      console.error('Error al crear orden de PayPal:', error);
      throw error;
    }
  };

export const capturePaypalPayment = async (orderId) => {
  try {
    const response = await axios.post(`${API_URL}/api/payments/capture/${orderId}`);
    console.log('Pago capturado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al capturar el pago:', error);
    throw error;
  }
};

export const openPaypalPopup = async (idPedido, monto) => {
    try {
      // Crear la orden de pago y obtener la URL y orderId
      const { approveUrl, orderId } = await createPaypalOrder(idPedido, monto);
      
      const width = 450;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
  
      // Guardar el orderId en localStorage para recuperarlo después
      localStorage.setItem('currentPaypalOrderId', orderId);
  
      const popup = window.open(
        approveUrl,
        'PayPal',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
      );
  
      if (!popup) {
        throw new Error('El navegador bloqueó la ventana emergente');
      }
  
      return popup;
    } catch (error) {
      console.error('Error al abrir ventana de PayPal:', error);
      throw error;
    }
};
