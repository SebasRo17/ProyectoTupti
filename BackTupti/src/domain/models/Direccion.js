const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class Direccion extends Model {}

Direccion.init({
  IdDireccion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Usuario_IdUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Direccion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  IdUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'direccion',
  timestamps: false
});

module.exports = Direccion;