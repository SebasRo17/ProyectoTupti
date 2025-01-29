import { API_URL } from '../config/config';

export const facturaApi = {
    // Obtener todas las facturas de un usuario
    getFacturasByUsuario: async (userId) => {
        try {
            const token = sessionStorage.getItem('token') || localStorage.getItem('token');
            console.log('Token para petición:', token);

            if (!token) {
                throw new Error('No hay token disponible');
            }

            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            });

            console.log('Headers de la petición:', Object.fromEntries(headers.entries()));

            const response = await fetch(`${API_URL}/factura/usuario/${userId}`, {
                method: 'GET',
                headers: headers,
                credentials: 'include'
            });

            console.log('Respuesta del servidor:', {
                status: response.status,
                statusText: response.statusText
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en getFacturasByUsuario:', error);
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
