const KardexProduct = require('../../domain/models/KardexProduct');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');
const { literal } = require('sequelize');

class KardexRepository {
  async getStockByProductId(idProducto) {
    try {
      const result = await KardexProduct.findAll({
        where: { IdProducto: idProducto },
        attributes: [
          [
            literal('SUM(CAST(Cantidad AS DECIMAL(10,2)))'),
            'totalStock'
          ]
        ],
        raw: true
      });
      
      const totalStock = parseFloat(result[0]?.totalStock || 0);
      return totalStock;
    } catch (error) {
      console.error('Error getting stock:', error);
      throw error;
    }
  }
  
  async create(kardexData) {
    try {
      const kardex = await KardexProduct.create({
        ...kardexData,
        Fecha: new Date()
      });
      return kardex;
    } catch (error) {
      console.error('Error al crear kardex:', error);
      throw error;
    }
  }
  async sumCantidadByIdProducto(idProducto) {
    const result = await KardexProduct.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('Cantidad')), 'totalCantidad']],
      where: { IdProducto: idProducto }
    });
    return result ? result.get('totalCantidad') : 0;
  }
}

module.exports = KardexRepository;