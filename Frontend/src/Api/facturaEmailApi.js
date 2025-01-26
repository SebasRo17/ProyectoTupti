import axios from 'axios';
import { API_BASE } from '../config/config.js';

export const enviarFacturaPorEmail = async (idPedido, pdfBase64, totalFactura) => {
    try {
        const token = localStorage.getItem('jwtToken');
        
        // Validación más estricta del totalFactura
        if (totalFactura === undefined || totalFactura === null) {
            throw new Error('Total de factura no proporcionado');
        }
        
        const total = Number(totalFactura);
        
        if (isNaN(total) || total <= 0) {
            throw new Error(`Total de factura inválido: ${totalFactura}`);
        }

        console.log('Enviando datos:', {
            idPedido,
            totalFactura: total,
            tipo: typeof total
        });

        const response = await axios.post(
            `${API_BASE.replace('/api', '')}/facturas/enviar`,
            {
                pdfData: pdfBase64,
                idPedido: Number(idPedido),
                totalFactura: total
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
        console.error('Error detallado al enviar factura:', error);
        throw error;
    }
};
