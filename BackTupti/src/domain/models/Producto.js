const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');
const TipoProducto = require('./TipoProducto');

class Producto extends Model {}

Producto.init({
  IdProducto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  Descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  IdTipoProducto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Stock: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  IdImpuesto: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'producto',
  timestamps: false
});

module.exports = Producto;