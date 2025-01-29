const FacturaService = require('../../aplication/services/FacturaService');

class FacturaController {
    static async getFacturasByUsuario(req, res) {
        try {
            const { idUsuario } = req.params;
            const facturas = await FacturaService.getFacturasByUsuario(idUsuario);
            res.json(facturas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async downloadFacturaPDF(req, res) {
        try {
            const { id } = req.params;
            const factura = await FacturaService.getFacturaPDF(id);
            
            if (!factura) {
                return res.status(404).json({ error: 'Factura no encontrada' });
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=factura-${id}.pdf`);
            res.send(factura.pdf_data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = FacturaController;
