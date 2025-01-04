const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class Pago extends Model {}

Pago.init({
  IdPago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IdOrdenPaypal: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  Moneda: {
    type: DataTypes.STRING(10),
    defaultValue: 'USD'
  },
  Estado: {
    type: DataTypes.ENUM('CREADO', 'COMPLETADO', 'FALLIDO'),
    defaultValue: 'CREADO'
  },
  IdPedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'pago',
  timestamps: true
});

module.exports = Pago;