const nodemailer = require('nodemailer');
const facturaRepository = require('../../infrastructure/repositories/FacturaEmailRepository');
const Pedido = require('../../domain/models/Pedido');

class FacturaEmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS // Cambiado a EMAIL_PASS para coincidir con EmailVerificationService
            }
        });
    }

    async guardarYEnviarFactura(pdfData, idPedido, emailDestino) {
        try {
            // Validar email
            if (!emailDestino) {
                throw new Error('Email de destino no proporcionado');
            }

            // Log para debugging
            console.log('Enviando factura a:', emailDestino);
            console.log('ID Pedido:', idPedido);

            // Verificar que el pedido existe
            const pedidoExistente = await Pedido.findByPk(idPedido);
            if (!pedidoExistente) {
                throw new Error(`El pedido con ID ${idPedido} no existe`);
            }

            // Guardar la factura en la base de datos
            const factura = await facturaRepository.guardarFactura({
                id_pedido: idPedido,
                pdf_data: pdfData,
                estado: 'GENERADA'
            });

            // Verificar la configuración del email antes de enviar
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                throw new Error('Configuración de email incompleta');
            }

            // Enviar el email usando la misma configuración que EmailVerificationService
            const mailOptions = {
                from: `"Tupti" <${process.env.EMAIL_USER}>`,
                to: emailDestino,
                subject: `Factura del pedido #${idPedido} - Tupti`,
                html: `
                    <h1>Gracias por tu compra en Tupti</h1>
                    <p>Adjunto encontrarás la factura de tu compra.</p>
                `,
                attachments: [{
                    filename: `factura-${idPedido}.pdf`,
                    content: pdfData
                }]
            };

            // Log de opciones de email
            console.log('Configuración de email:', {
                from: mailOptions.from,
                to: mailOptions.to,
                subject: mailOptions.subject
            });

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email enviado:', info.messageId);

            // Actualizar el estado de envío
            await facturaRepository.actualizarEstadoEnvio(factura.id);

            return { 
                success: true, 
                message: 'Factura guardada y enviada correctamente',
                emailInfo: {
                    messageId: info.messageId,
                    to: emailDestino
                }
            };
        } catch (error) {
            console.error('Error detallado:', error);
            throw new Error('Error en el proceso de factura: ' + error.message);
        }
    }
}

module.exports = new FacturaEmailService();
