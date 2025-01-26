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

    async guardarYEnviarFactura(pdfData, idPedido, emailDestino, nombreCliente, totalFactura) {
        try {
            // Validar email y total
            if (!emailDestino) {
                throw new Error('Email de destino no proporcionado');
            }

            // Asegurar que totalFactura sea un número válido
            const total = Number(totalFactura);
            if (isNaN(total)) {
                throw new Error('Total de factura inválido');
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

            const numeroFactura = `001-004-${idPedido.toString().padStart(9, '0')}`;

            // Enviar el email usando la misma configuración que EmailVerificationService
            const mailOptions = {
                from: `"Tupti" <${process.env.EMAIL_USER}>`,
                to: emailDestino,
                subject: `Factura del pedido #${idPedido} - Tupti`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                        <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
                            <img src="https://res.cloudinary.com/dd7etqrf2/image/upload/v1734638598/tupti_3_r82cww_dsbubc.png" alt="Tupti" style="max-width: 150px;">
                        </div>
                        <div style="padding: 20px;">
                            <p>Estimado(a):</p>
                            <h2 style="margin: 0;">${nombreCliente}</h2>
                            <p>Le contactamos para enviarle su documento electrónico:</p>
                            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;">Tipo:</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">Factura</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;">Número:</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${numeroFactura}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;">Valor:</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">USD ${total.toFixed(2)}</td>
                                </tr>
                            </table>
                            <p>Gracias por ser parte de nuestra empresa.</p>
                        </div>
                        <div style="background-color: #333; color: #fff; text-align: center; padding: 10px; font-size: 12px;">
                            Este correo fue generado de forma automática. Por favor no responder.<br>
                            Tupti Quito, Valle de los Chillos.
                        </div>
                    </div>
                `,
                attachments: [{
                    filename: `factura-${numeroFactura}.pdf`,
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
