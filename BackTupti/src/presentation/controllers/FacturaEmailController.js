const facturaEmailService = require('../../aplication/services/FacturaEmailService');

class FacturaEmailController {
    async enviarFactura(req, res) {
        try {
            const { pdfData, idPedido, totalFactura } = req.body;
            
            console.log('Datos recibidos en el controlador:', {
                totalFactura,
                tipo: typeof totalFactura
            });

            // Validación más estricta
            if (totalFactura === undefined || totalFactura === null) {
                return res.status(400).json({
                    success: false,
                    message: 'Total de factura no proporcionado',
                    debug: { receivedTotal: totalFactura }
                });
            }

            const total = Number(totalFactura);
            
            if (isNaN(total) || total <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El total de la factura debe ser un número válido mayor a 0',
                    debug: { 
                        receivedTotal: totalFactura,
                        parsedTotal: total,
                        tipo: typeof totalFactura
                    }
                });
            }
            
            // Log completo del objeto user para debugging
            console.log('Información del usuario:', req.user);
            
            const emailDestino = req.user?.email;
            const nombreCliente = req.user?.nombres || 'Estimado Cliente';
            
            // Validación más detallada del email
            if (!emailDestino) {
                console.error('Email no encontrado en el token:', req.user);
                return res.status(400).json({
                    success: false,
                    message: 'No se encontró el email del usuario en el token',
                    debug: process.env.NODE_ENV === 'development' ? { user: req.user } : undefined
                });
            }

            console.log('Datos recibidos:', {
                idPedido,
                emailDestino,
                pdfDataLength: pdfData?.length
            });

            if (!pdfData || !idPedido) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de factura incompletos'
                });
            }

            // Validar que idPedido sea un número válido
            if (!Number.isInteger(Number(idPedido))) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID del pedido debe ser un número válido'
                });
            }

            const resultado = await facturaEmailService.guardarYEnviarFactura(
                Buffer.from(pdfData, 'base64'),
                idPedido,
                emailDestino,
                nombreCliente,
                totalFactura
            );

            res.status(200).json(resultado);
        } catch (error) {
            console.error('Error en controlador:', error);
            const statusCode = error.message.includes('no existe') ? 404 : 500;
            
            res.status(statusCode).json({
                success: false,
                message: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
}

module.exports = new FacturaEmailController();
