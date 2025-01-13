const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class Descuento extends Model {}

Descuento.init({
  IdDescuento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IdTipoProducto: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  IdProducto: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Porcentaje: {
    type: DataTypes.STRING,
    allowNull: true
  },
  FechaInicio: {
    type: DataTypes.DATE,
    allowNull: true
  },
  FechaFin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  Activo: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'descuento',
  timestamps: false
});

module.exports = Descuento;