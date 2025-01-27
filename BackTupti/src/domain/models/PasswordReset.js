const { DataTypes } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');
const Usuario = require('./User');

const PasswordReset = sequelize.define('PasswordReset', {
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
  tableName: 'password_resets',
  timestamps: true
});

PasswordReset.belongsTo(Usuario, { foreignKey: 'IdUsuario' });

module.exports = PasswordReset;