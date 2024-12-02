const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class Factura extends Model {}

Factura.init({
  IdFactura: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IdPedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  FechaEmision: {
    type: DataTypes.DATE,
    allowNull: true
  },
  SubTotal: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Iva: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Total: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'factura',
  timestamps: false
});

module.exports = Factura;