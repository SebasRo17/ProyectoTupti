import axios from 'axios';
import { API_BASE } from '../config/config.js';

export const enviarFacturaPorEmail = async (idPedido, pdfBase64) => {
    try {
        const token = localStorage.getItem('jwtToken');
        
        const response = await axios.post(
            `${API_BASE.replace('/api', '')}/facturas/enviar`,
            {
                pdfData: pdfBase64,
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
