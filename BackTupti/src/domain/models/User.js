const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class User extends Model {}

User.init({
  IdUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CodigoUs: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  Contrasenia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 1
  }
}, {
  sequelize,
  tableName: 'usuario',
  timestamps: false
});

module.exports = User;