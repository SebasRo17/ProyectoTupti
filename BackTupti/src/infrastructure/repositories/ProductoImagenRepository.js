const ProductoImagen = require('../../domain/models/ProductoImagen');

class ProductoImagenRepository {
  async createProductoImagen(data) {
    return await ProductoImagen.create(data);
  }

}

module.exports = new ProductoImagenRepository();