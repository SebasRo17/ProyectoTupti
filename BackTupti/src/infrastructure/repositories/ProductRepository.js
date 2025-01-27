const Product = require('../../domain/models/Producto');
const TipoProducto = require('../../domain/models/TipoProducto');

class ProductRepository {
  async findProductDetailsById(idProducto) {
    try {
      return await Product.findByPk(idProducto, {
        attributes: ['Nombre', 'IdTipoProducto'],
        include: [{
          model: TipoProducto,
          as: 'TipoProducto',
          attributes: ['detalle']
        }]
      });
    } catch (error) {
      console.error('Error en repositorio:', error);
      throw error;
    }
  }
  async create(productData) {
    try {
      const product = await Product.create(productData);
      return product;
    } catch (error) {
      console.error('Error en el repositorio al crear producto:', error);
      throw error;
    }
  }
}

module.exports = new ProductRepository();