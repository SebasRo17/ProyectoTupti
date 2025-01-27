const ImpuestoService = require('../../aplication/services/ImpuestoService');

class ImpuestoController {
  async getAllImpuestos(req, res) {
    try {
      const impuestos = await ImpuestoService.getAllImpuestos();
      res.status(200).json(impuestos);
    } catch (error) {
      console.error('Error en el controlador al obtener impuestos:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = new ImpuestoController();