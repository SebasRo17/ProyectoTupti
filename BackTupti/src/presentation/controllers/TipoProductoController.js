const TipoProductoService = require('../../aplication/services/TipoProductoService');

class TipoProductoController {
  async getAllTipoProductos(req, res) {
    try {
      const tipoProductos = await TipoProductoService.getAllTipoProductos();
      res.status(200).json(tipoProductos);
    } catch (error) {
      console.error('Error en el controlador al obtener tipos de producto:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = new TipoProductoController();