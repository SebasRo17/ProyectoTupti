const KardexProductService = require('../../aplication/services/KardexProductService');

class KardexProductController {
  async createKardex(req, res) {
    try {
      const kardexData = req.body;
      const result = await KardexProductService.createKardex(kardexData);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error en el controlador de kardex:', error);
      res.status(500).json({ message: 'Error al crear el kardex' });
    }
  }
  async sumCantidadByIdProducto(req, res) {
    try {
      const { idProducto } = req.params;
      const totalCantidad = await KardexProductService.sumCantidadByIdProducto(idProducto);
      res.status(200).json({ totalCantidad });
    } catch (error) {
      console.error('Error en el controlador al sumar cantidad:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new KardexProductController();