const Factura = require('../../domain/models/Facturas');

class FacturaEmailRepository {
    async guardarFactura(facturaData) {
        try {
            return await Factura.create(facturaData);
        } catch (error) {
            throw new Error('Error al guardar la factura: ' + error.message);
        }
    }

    async actualizarEstadoEnvio(facturaId) {
        try {
            return await Factura.update({
                email_enviado: true,
                fecha_envio: new Date()
            }, {
                where: { id: facturaId }
            });
        } catch (error) {
            throw new Error('Error al actualizar el estado de envío: ' + error.message);
        }
    }

    async obtenerFacturaPorPedido(idPedido) {
        try {
            return await Factura.findOne({
                where: { id_pedido: idPedido }
            });
        } catch (error) {
            throw new Error('Error al obtener la factura: ' + error.message);
        }
    }
}

module.exports = new FacturaEmailRepository();
