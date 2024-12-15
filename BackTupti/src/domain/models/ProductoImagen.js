const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class ProductoImagen extends Model {}

ProductoImagen.init({
  IdImagen: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  IdProducto: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: 'producto',
      key: 'IdProducto'
    }
  },
  ImagenUrl: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'productoImagen',
  timestamps: false
});

module.exports = ProductoImagen;
