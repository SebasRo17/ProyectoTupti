const TipoProducto = require('../../domain/models/TipoProducto');

class TipoProductoRepository {
  async findAll() {
    try {
      return await TipoProducto.findAll();
    } catch (error) {
      console.error('Error en el repositorio al obtener tipos de producto:', error);
      throw error;
    }
  }

}

module.exports = new TipoProductoRepository();