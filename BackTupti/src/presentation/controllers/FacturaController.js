const FacturaService = require('../../aplication/services/FacturaService');

class FacturaController {
    static async getFacturasByUsuario(req, res) {
        console.group('📄 Petición de Facturas');
        try {
            const { idUsuario } = req.params;
            console.log('Token decodificado en req.user:', req.user);
            console.log('ID Usuario solicitado:', idUsuario);
            console.log('ID Usuario del token:', req.user?.IdUsuario);

            // Verificar que el usuario del token coincide con el solicitado
            if (req.user?.IdUsuario !== parseInt(idUsuario)) {
                console.error('❌ IDs de usuario no coinciden');
                return res.status(403).json({
                    error: 'No autorizado',
                    details: 'El usuario no tiene permiso para ver estas facturas'
                });
            }

            const facturas = await FacturaService.getFacturasByUsuario(idUsuario);
            console.log('✅ Facturas recuperadas:', facturas.length);
            res.json(facturas);
        } catch (error) {
            console.error('❌ Error:', error);
            res.status(500).json({ error: error.message });
        } finally {
            console.groupEnd();
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
