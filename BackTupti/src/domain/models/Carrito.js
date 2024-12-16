const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class Carrito extends Model {}

Carrito.init({
  IdCarrito: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IdUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Estado: {
    type: DataTypes.ENUM('ACTIVO', 'COMPRADO', 'ABANDONADO'),
    defaultValue: 'ACTIVO'
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
  tableName: 'carrito',
  timestamps: true
});

module.exports = Carrito;