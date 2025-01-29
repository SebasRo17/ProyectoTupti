import { API_URL } from '../config/config';

export const facturaApi = {
    getFacturasByUsuario: async (userId) => {
        console.group('🌐 Petición getFacturasByUsuario');
        try {
            const token = sessionStorage.getItem('token') || localStorage.getItem('token');
            
            console.log('📝 Detalles de la petición:', {
                url: `${API_URL}/factura/usuario/${userId}`,
                userId,
                tokenExists: !!token
            });

            if (!token) {
                throw new Error('Token no disponible para la petición');
            }

            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            });

            console.log('🔒 Headers configurados:', Object.fromEntries(headers.entries()));

            const response = await fetch(`${API_URL}/factura/usuario/${userId}`, {
                method: 'GET',
                headers: headers,
                credentials: 'include'
            });

            console.log('📨 Respuesta recibida:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Datos recibidos:', data);
            return data;
        } catch (error) {
            console.error('❌ Error en petición:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        } finally {
            console.groupEnd();
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
