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
  async deleteProductoById(id) {
    return await Product.destroy({ where: { IdProducto: id } });
  }
  async updatePartial(idProducto, updateData) {
    try {
      const [updatedRows] = await Product.update(
        {
          Nombre: updateData.nombre,
          Precio: updateData.precio,
          Descripcion: updateData.descripcion
        },
        {
          where: { IdProducto: idProducto }
        }
      );

      if (updatedRows === 0) {
        throw new Error('Producto no encontrado');
      }

      // Obtener el producto actualizado
      const updatedProduct = await Product.findByPk(idProducto);
      return updatedProduct;
    } catch (error) {
      console.error('Error en repository al actualizar producto:', error);
      throw error;
    }
  }
}

module.exports = new ProductRepository();