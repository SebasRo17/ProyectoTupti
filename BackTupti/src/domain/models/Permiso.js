const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class Permiso extends Model {}

Permiso.init({
  IdPermiso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IdRol: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IdUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'permiso',
  timestamps: false
});

module.exports = Permiso;