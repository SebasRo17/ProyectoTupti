const DescuentoService = require('../../aplication/services/descuentoService');

class DescuentoController {
  constructor() {
    this.descuentoService = new DescuentoService();
  }

  async createDescuento(req, res) {
    try {
      const descuento = await this.descuentoService.createDescuento(req.body);
      res.status(201).json(descuento);
    } catch (error) {
      console.error('Error en el controlador:', error);
      res.status(400).json({ 
        message: 'Error al crear descuento',
        error: error.message 
      });
    }
  }

  async updateDescuento(req, res) {
    try {
      const descuento = await this.descuentoService.updateDescuento(req.params.id, req.body);
      res.json(descuento);
    } catch (error) {
      console.error('Error en el controlador:', error);
      res.status(400).json({ 
        message: 'Error al actualizar descuento',
        error: error.message 
      });
    }
  }

  async getCarritoDescuento(req, res) {
    try {
      const resultado = await this.descuentoService.calcularDescuentoCarrito(req.params.idCarrito);
      res.json(resultado);
    } catch (error) {
      console.error('Error en el controlador:', error);
      res.status(500).json({ 
        message: 'Error al calcular descuento del carrito',
        error: error.message 
      });
    }
  }
}

module.exports = new DescuentoController();