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
    type: DataTypes.STRING(45),
    allowNull: false
  },
  FechaInicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  FechaFin: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  tableName: 'descuento',
  timestamps: false
});

module.exports = Descuento;