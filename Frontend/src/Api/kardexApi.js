import { API_URL } from '../config/config';

export const createKardexProduct = async (kardexData) => {
  try {
    console.log('kardexData:', kardexData);
    const response = await fetch(`${API_URL}/kardex-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kardexData)
    });

    if (!response.ok) {
      if (response.status === 500) {
        throw new Error('Error del servidor al crear Kardex');
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear Kardex:', error);
    return null;
  }
};
export const validateStock = async (idProducto, cantidad) => {
    try {
      const response = await fetch(`${API_URL}/api/stock/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idProducto, cantidad })
      });
  
      const data = await response.json();
      
      // Handle non-200 responses
      if (!response.ok) {
        console.log('Error response:', data);
        return {
          disponible: false,
          error: data.error || 'Error al validar stock'
        };
      }

      // Success response
      return {
        disponible: true,
        stockDisponible: data.stockDisponible,
        cantidadSolicitada: data.cantidadSolicitada,
        ...data
      };

    } catch (error) {
      console.error('Error al validar stock:', error);
      return {
        disponible: false,
        error: 'Error al validar el stock'
      };
    }
};
export const sumCantidadByIdProducto = async (idProducto) => {
    try {
      const response = await fetch(`${API_URL}/kardex-product/sum/${idProducto}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.totalCantidad;
    } catch (error) {
      console.error('Error al sumar cantidad por IdProducto:', error);
      throw error;
    }
  };