const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class KardexProduct extends Model {}

KardexProduct.init({
  IdKardexProduct: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Producto_IdProducto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Movimiento: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Cantidad: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Fecha: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'kardexproduct',
  timestamps: false
});

module.exports = KardexProduct;