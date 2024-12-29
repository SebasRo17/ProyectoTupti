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
    type: DataTypes.BOOLEAN,
    allowNull: true,
    comment: 'Define el estado del pedido\n\n\n\n4: Entegado\n\n7: Reembolsado\n9: En espera'
  }
}, {
  sequelize,
  tableName: 'pedido',
  timestamps: false
});

module.exports = Pedido;