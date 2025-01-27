import { API_URL } from '../config/config';

export const createPaypalOrder = async (idPedido, monto) => {
  try {
    const response = await fetch(`${API_URL}/api/payments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idPedido, monto }),
    });

    if (!response.ok) {
      throw new Error('Error al crear la orden de pago');
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error al crear orden de PayPal: ${error.message}`);
  }
};
export const capturePaypalPayment = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/api/payments/capture/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al capturar el pago');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en capturePaypalPayment:', error);
    throw new Error(`Error al capturar el pago: ${error.message}`);
  }
};
export const openPaypalPopup = async (idPedido, monto) => {
  try {
    const { approveUrl, orderId } = await createPaypalOrder(idPedido, monto);
    
    const width = 450;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

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

export const checkPaypalOrderStatus = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/api/payments/status/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al verificar el estado del pago');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al verificar estado del pago:', error);
    throw error;
  }
};