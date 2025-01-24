const {kardexRepository} = require('../../infrastructure/repositories/KardexRepository');

class StockService {
  constructor(kardexRepository) {
    this.kardexRepository = kardexRepository;
  }

  async validateStock(idProducto, cantidad) {
    const stock = await this.kardexRepository.getStockByProductId(idProducto);
    
    if (cantidad > stock) {
      throw new Error(`Stock insuficiente. Stock disponible: ${stock}`);
    }

    return {
      idProducto,
      stockDisponible: stock,
      cantidadSolicitada: cantidad,
      disponible: true
    };
  }
}

module.exports = StockService;