const TipoProductoRepository = require('../../infrastructure/repositories/TipoProductoRepository');

class TipoProductoService {
  async getAllTipoProductos() {
    try {
      return await TipoProductoRepository.findAll();
    } catch (error) {
      console.error('Error en el servicio al obtener tipos de producto:', error.message);
      throw error;
    }
  }

}

module.exports = new TipoProductoService();