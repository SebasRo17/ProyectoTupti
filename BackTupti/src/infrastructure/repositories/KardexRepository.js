const { Sequelize, literal } = require('sequelize');
const KardexProduct = require('../../domain/models/KardexProduct');
const sequelize = require('../../infrastructure/database/mysqlConnection');

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
}

module.exports = KardexRepository;