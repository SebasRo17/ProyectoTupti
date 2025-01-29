const Factura = require('../../domain/models/Facturas');
const Pedido = require('../../domain/models/Pedido');
const User = require('../../domain/models/User');

class FacturaRepository {
    static async getFacturasByUsuario(idUsuario) {
        try {
            console.log('Buscando facturas para usuario:', idUsuario);
            const facturas = await Factura.findAll({
                attributes: ['id', 'id_pedido', 'fecha_creacion'],
                include: [{
                    model: Pedido,
                    as: 'pedido',
                    required: true,
                    where: { IdUsuario: idUsuario },
                    attributes: ['IdPedido', 'IdUsuario']
                }],
                order: [['fecha_creacion', 'DESC']]
            });
            
            console.log('Facturas encontradas:', JSON.stringify(facturas, null, 2));
            return facturas;
        } catch (error) {
            console.error('Error en repositorio:', error);
            throw new Error('Error al obtener las facturas: ' + error.message);
        }
    }

    static async getFacturaPDF(id) {
        try {
            const factura = await Factura.findByPk(id, {
                attributes: ['id', 'pdf_data']
            });
            return factura;
        } catch (error) {
            throw new Error('Error al obtener el PDF de la factura: ' + error.message);
        }
    }
}

module.exports = FacturaRepository;
