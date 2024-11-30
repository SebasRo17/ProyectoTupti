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
    allowNull: true  // Cambiar a true para permitir login social
  },
  Activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 1
  },
  FacebookId: {  // Nuevo campo
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  Nombre: {  // Agregar campo de nombre
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'usuario',
  timestamps: false
});

module.exports = User;