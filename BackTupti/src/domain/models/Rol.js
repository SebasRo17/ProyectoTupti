const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class Rol extends Model {}

Rol.init({
  IdRol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Detalle: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '\nAdministrador\nCliente\nRepartidor'
  }
}, {
  sequelize,
  tableName: 'rol',
  timestamps: false
});

module.exports = Rol;