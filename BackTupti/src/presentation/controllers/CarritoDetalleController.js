const CarritoDetalleService = require('../../aplication/services/CarritoDetalleService');

class CarritoDetalleController {
  async deleteDetalle(req, res) {
    try {
      const { id } = req.params;
      const result = await CarritoDetalleService.deleteDetalle(id);
      res.json(result);
    } catch (error) {
      console.error('Error en el controlador:', error);
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = new CarritoDetalleController();