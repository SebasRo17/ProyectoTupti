import { API_URL } from '../config/config';

const getAuthToken = () => {
    const token = localStorage.getItem('jwtToken');
    console.log('Token encontrado:', token ? 'Sí' : 'No');
    console.log('Token completo:', token);
    return token;
};

export const facturaApi = {
    getFacturasByUsuario: async (userId) => {
        console.group('🌐 Petición getFacturasByUsuario');
        try {
            const token = getAuthToken();
            
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            });

            console.log('Request completo:', {
                url: `${API_URL}/factura/usuario/${userId}`,
                headers: Object.fromEntries(headers.entries()),
                token: token
            });

            const response = await fetch(`${API_URL}/factura/usuario/${userId}`, {
                method: 'GET',
                headers: headers,
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en petición:', error);
            throw error;
        } finally {
            console.groupEnd();
        }
    },

    // Descargar PDF de una factura
    downloadFacturaPDF: async (facturaId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`${API_URL}/factura/download/${facturaId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
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
