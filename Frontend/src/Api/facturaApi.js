import { API_URL } from '../config/config';

export const facturaApi = {
    // Obtener todas las facturas de un usuario
    getFacturasByUsuario: async (userId) => {
        try {
            const token = localStorage.getItem('token');
            console.log('API - UserId:', userId); // Debug
            console.log('API - Token:', token); // Debug

            if (!userId) {
                throw new Error('ID de usuario no proporcionado');
            }

            const response = await fetch(`${API_URL}/factura/usuario/${userId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('API - Response status:', response.status); // Debug

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API - Datos recibidos:', data); // Debug
            return data;
        } catch (error) {
            console.error('API - Error completo:', error);
            throw error;
        }
    },

    // Descargar PDF de una factura
    downloadFacturaPDF: async (facturaId) => {
        try {
            const response = await fetch(`${API_URL}/factura/download/${facturaId}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al descargar la factura');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            // Crear un elemento <a> temporal para descargar el archivo
            const link = document.createElement('a');
            link.href = url;
            link.download = `factura-${facturaId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Error en downloadFacturaPDF:', error);
            throw error;
        }
    },

    // Verificar el estado de una factura
    checkFacturaStatus: async (facturaId) => {
        try {
            const response = await fetch(`${API_URL}/factura/status/${facturaId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Error al verificar el estado de la factura');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en checkFacturaStatus:', error);
            throw error;
        }
    }
};
