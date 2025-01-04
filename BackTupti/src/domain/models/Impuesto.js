const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class Impuesto extends Model {}

Impuesto.init({
  IdImpuesto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Porcentaje: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  Tipo: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  Aplicable: {
    type: DataTypes.TINYINT(1),
    defaultValue: 1
  },
  CodigoImpuesto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  CodigoIVA: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  CodigoICE: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'Impuesto',
  timestamps: false
});

module.exports = Impuesto;