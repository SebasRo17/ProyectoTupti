const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class Pedido extends Model {}

Pedido.init({
  IdPedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IdUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Direccion_IdDireccion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Estado: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0, // Valor por defecto como definido en la tabla
    comment: 'Define el estado del pedido:\n0: Espera\n1: Reembolsado\n2: Entregado'
  },
  IdCarrito: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true // Define la restricción UNIQUE
  }
}, {
  sequelize,
  tableName: 'pedido',
  timestamps: false
});

module.exports = Pedido;