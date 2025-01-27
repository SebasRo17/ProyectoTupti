const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');
const TipoProducto = require('./TipoProducto');
const ProductoImagen = require('./ProductoImagen');

class Product extends Model {}

Product.init({
  IdProducto: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  Descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  IdTipoProducto: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: 'tipoproducto',
      key: 'IdTipoProducto'
    }
  },
  Stock: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  IdImpuesto: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: 'impuesto',
      key: 'IdImpuesto'
    }
  }
}, {
  sequelize,
  tableName: 'producto',
  timestamps: false
});

// Establecer asociaciones
Product.belongsTo(TipoProducto, { 
  foreignKey: 'IdTipoProducto', 
  as: 'TipoProducto' 
});
Product.hasMany(ProductoImagen, { 
  foreignKey: 'IdProducto', 
  as: 'Imagenes' 
});

module.exports = Product;