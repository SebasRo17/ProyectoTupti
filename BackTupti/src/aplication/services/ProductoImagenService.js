const ProductoImagenRepository = require('../../infrastructure/repositories/ProductoImagenRepository');

class ProductoImagenService {
  async createProductoImagen(data) {
    return await ProductoImagenRepository.createProductoImagen(data);
  }

}

module.exports = new ProductoImagenService();