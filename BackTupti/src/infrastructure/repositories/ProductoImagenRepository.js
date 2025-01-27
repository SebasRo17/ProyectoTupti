const ProductoImagen = require('../../domain/models/ProductoImagen');

class ProductoImagenRepository {
  async createProductoImagen(data) {
    return await ProductoImagen.create(data);
  }
  async deleteProductoImagenById(idProductoImagen) {
    return await ProductoImagen.destroy({ where: { IdImagen: idProductoImagen } });
  }
  async getProductoImagenesByIdProducto(idProducto) {
    return await ProductoImagen.findAll({
      attributes: ['IdImagen', 'ImagenUrl'],
      where: { IdProducto: idProducto }
    });
  }
}

module.exports = new ProductoImagenRepository();