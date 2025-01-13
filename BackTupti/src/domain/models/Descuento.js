// src/domain/models/Descuento.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');
const Product = require('./Producto');
const TipoProducto = require('./TipoProducto');

class Descuento extends Model {}

Descuento.init({
  IdDescuento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IdTipoProducto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tipoproducto',
      key: 'IdTipoProducto'
    }
  },
  IdProducto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'producto',
      key: 'IdProducto'
    }
  },
  Porcentaje: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  FechaInicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  FechaFin: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  tableName: 'descuento',
  timestamps: false
});

// Establecer asociaciones
Descuento.belongsTo(Product, { foreignKey: 'IdProducto', as: 'Producto' });
Descuento.belongsTo(TipoProducto, { foreignKey: 'IdTipoProducto', as: 'TipoProducto' });

module.exports = Descuento;