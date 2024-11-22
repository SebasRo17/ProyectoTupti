const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class Producto extends Model {}

Producto.init({
  IdProducto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IdTipoProducto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Stock: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'producto',
  timestamps: false
});

module.exports = Producto;