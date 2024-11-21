const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class DetallePedido extends Model {}

DetallePedido.init({
  IdDetallePedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IdProducto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IdPedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'detallepedido',
  timestamps: false
});

module.exports = DetallePedido;