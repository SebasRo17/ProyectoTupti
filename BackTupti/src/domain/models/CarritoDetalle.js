const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');
const Producto = require('./Producto'); // Asume que tienes un modelo de Producto

class CarritoDetalle extends Model {}

CarritoDetalle.init({
  IdCarritoDetalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IdCarrito: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IdProducto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  PrecioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'carrito_detalle',
  timestamps: false
});

// Definir asociaciones
CarritoDetalle.belongsTo(Producto, { 
  foreignKey: 'IdProducto', 
  as: 'Producto' 
});

module.exports = CarritoDetalle;