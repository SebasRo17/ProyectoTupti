const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class TipoProducto extends Model {}

TipoProducto.init({
  IdTipoProducto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  sequelize,
  tableName: 'tipoproducto',
  timestamps: false
});

module.exports = TipoProducto;