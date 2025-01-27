const KardexProductRepository = require('../../infrastructure/repositories/KardexRepository');

class KardexProductService {
  constructor() {
    this.kardexRepository = new KardexProductRepository();
  }

  async createKardex(kardexData) {
    try {
      const kardex = await this.kardexRepository.create({
        IdProducto: kardexData.idProducto,
        Movimiento: kardexData.movimiento,
        Cantidad: kardexData.cantidad
      });
      return kardex;
    } catch (error) {
      console.error('Error en el servicio de kardex:', error);
      throw error;
    }
  }
  async sumCantidadByIdProducto(idProducto) {
    try {
      return await this.kardexRepository.sumCantidadByIdProducto(idProducto);
    } catch (error) {
      console.error('Error en el servicio al sumar cantidad:', error);
      throw error;
    }
  }
}

module.exports = new KardexProductService();