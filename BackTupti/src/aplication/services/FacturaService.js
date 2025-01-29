const FacturaRepository = require('../../infrastructure/repositories/facturaRepository');

class FacturaService {
    static async getFacturasByUsuario(idUsuario) {
        try {
            if (!idUsuario) {
                throw new Error('ID de usuario no proporcionado');
            }

            const facturas = await FacturaRepository.getFacturasByUsuario(idUsuario);
            
            if (!facturas || facturas.length === 0) {
                return [];
            }

            return facturas.map(factura => ({
                idPedido: factura.id_pedido,
                fechaCreacion: factura.fecha_creacion,
                pdfUrl: `/factura/download/${factura.id}`
            }));
        } catch (error) {
            console.error('Error en servicio:', error);
            throw new Error('Error en el servicio de facturas: ' + error.message);
        }
    }

    static async getFacturaPDF(id) {
        try {
            return await FacturaRepository.getFacturaPDF(id);
        } catch (error) {
            throw new Error('Error al obtener el PDF: ' + error.message);
        }
    }
}

module.exports = FacturaService;
