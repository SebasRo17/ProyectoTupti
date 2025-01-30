const ProductoImagenRepository = require('../../infrastructure/repositories/ProductoImagenRepository');

class ProductoImagenService {
  async createProductoImagen(data) {
    return await ProductoImagenRepository.createProductoImagen(data);
  }
  async deleteProductoImagenById(idProductoImagen) {
    const deleted = await ProductoImagenRepository.deleteProductoImagenById(idProductoImagen);
    if (!deleted) {
      throw new Error('Imagen no encontrada');
    }
    return deleted;
  }
  async getProductoImagenesByIdProducto(idProducto) {
    return await ProductoImagenRepository.getProductoImagenesByIdProducto(idProducto);
  }
}

module.exports = new ProductoImagenService();