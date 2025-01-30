const ProductoImagen = require('../../domain/models/ProductoImagen');

class ProductoImagenRepository {
  async createProductoImagen(data) {
    try {
      const productoImagen = await ProductoImagen.create(data);
      return productoImagen;
    } catch (error) {
      console.error('Error en el repositorio al crear ProductoImagen:', error.message);
      throw error;
    }
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