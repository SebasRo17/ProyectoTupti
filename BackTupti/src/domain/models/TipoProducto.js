const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class TipoProducto extends Model {}

TipoProducto.init({
  IdTipoProducto: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  detalle: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'tipoproducto',
  timestamps: false
});

module.exports = TipoProducto;