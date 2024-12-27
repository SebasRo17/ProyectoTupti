const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class Direccion extends Model {}

Direccion.init({
  IdDireccion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IdUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  CallePrincipal: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Numeracion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  CalleSecundaria: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Vecindario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Ciudad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Provincia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Pais: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Direccion',
  tableName: 'direccion',
  timestamps: false
});

module.exports = Direccion;