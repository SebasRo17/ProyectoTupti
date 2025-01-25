import axios from 'axios';
import { API_BASE } from '../config/config.js';

export const enviarFacturaPorEmail = async (idPedido) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.IdUsuario;

        // 1. Obtener el PDF directamente de la ruta correcta usando el ID del usuario
        const pdfResponse = await axios.get(`${window.location.origin}/pdf/${userId}`, {
            responseType: 'arraybuffer'
        });

        // 2. Convertir ArrayBuffer a base64
        const base64Data = btoa(
            new Uint8Array(pdfResponse.data)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        // 3. Enviar al servidor
        const response = await axios.post(
            `${API_BASE.replace('/api', '')}/facturas/enviar`,
            {
                pdfData: base64Data,
                idPedido
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error al enviar la factura por email:', error);
        throw error;
    }
};
