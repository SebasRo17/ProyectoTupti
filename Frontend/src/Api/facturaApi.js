import { API_URL } from '../config/config';

const getAuthToken = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
        throw new Error('Token no disponible');
    }
    console.log('Token encontrado en API:', token.substring(0, 20) + '...');
    return token;
};

export const facturaApi = {
    getFacturasByUsuario: async (userId) => {
        try {
            const token = getAuthToken();
            
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            
            console.log('Headers de la petición:', headers);
            
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
                throw new Error(`Error en la petición: ${response.status}`);
            }

            return await response.json();
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
