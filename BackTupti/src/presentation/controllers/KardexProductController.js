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
}

module.exports = new KardexProductController();