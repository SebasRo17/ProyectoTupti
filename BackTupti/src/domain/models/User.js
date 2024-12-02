const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class User extends Model {}

User.init({
  IdUsuario: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  CodigoUs: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  Email: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  Contrasenia: {
    type: DataTypes.STRING,
    allowNull: true  // Cambiar a true para permitir login social
  },
  Activo: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
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

  IdRol: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    references: {
      model: 'rol', // Nombre de la tabla referenciada
      key: 'IdRol'  // Nombre de la columna referenciada
    }
  }
}, {
  sequelize,
  tableName: 'usuario',
  timestamps: false
});

module.exports = User;