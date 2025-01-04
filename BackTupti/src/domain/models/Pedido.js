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
    allowNull: false,
    references: {
      model: 'usuario',
      key: 'IdUsuario'
    }
  },
  Direccion_IdDireccion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'direccion',
      key: 'IdDireccion'
    }
  },
  Estado: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 0,
    comment: 'Define el estado del pedido:\r\n0: Espera\r\n1: Reembolsado\r\n2: Entregado'
  },
  IdCarrito: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'carrito',
      key: 'IdCarrito'
    }
  }
}, {
  sequelize,
  tableName: 'pedido',
  timestamps: false
});

module.exports = Pedido;