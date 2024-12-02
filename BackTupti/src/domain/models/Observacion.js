const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class Observacion extends Model {}

Observacion.init({
  IdObservacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Detalle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Pedido_IdPedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'observacion',
  timestamps: false
});

module.exports = Observacion;