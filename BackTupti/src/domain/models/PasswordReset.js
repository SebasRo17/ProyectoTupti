const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');
const Usuario = require('./User'); // Corregir la ruta de importación

class PasswordReset extends Model {}

PasswordReset.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IdUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'IdUsuario'
    }
  },
  token: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  tableName: 'password_resets',
  timestamps: true
});

PasswordReset.belongsTo(Usuario, { foreignKey: 'IdUsuario' });

module.exports = PasswordReset;