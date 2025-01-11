const CarritoDetalle = require('../../domain/models/CarritoDetalle');
const Product = require('../../domain/models/Producto');

class CarritoDetalleRepository {
    async findByCarritoId(idCarrito) {
        try {
          const detalles = await CarritoDetalle.findAll({
            where: { IdCarrito: idCarrito },
            include: [{
              model: Product,
              as: 'Producto',
              attributes: ['IdProducto', 'Nombre', 'IdTipoProducto', 'Precio']
            }]
          });
          return detalles;
        } catch (error) {
          console.error('Error al obtener detalles del carrito:', error);
          throw error;
        }
      }
  async findById(id) {
    try {
      return await CarritoDetalle.findByPk(id, {
        include: [{
          model: Product,
          as: 'Producto',
          attributes: ['IdProducto', 'Nombre', 'IdTipoProducto', 'Precio']
        }]
      });
    } catch (error) {
      console.error('Error al obtener detalle de carrito:', error);
      throw error;
    }
  }

  async create(detalleData) {
    try {
      return await CarritoDetalle.create(detalleData);
    } catch (error) {
      console.error('Error al crear detalle de carrito:', error);
      throw error;
    }
  }

  async update(id, detalleData) {
    try {
      const detalle = await CarritoDetalle.findByPk(id);
      if (!detalle) {
        throw new Error('Detalle de carrito no encontrado');
      }
      return await detalle.update(detalleData);
    } catch (error) {
      console.error('Error al actualizar detalle de carrito:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const detalle = await CarritoDetalle.findByPk(id);
      if (!detalle) {
        throw new Error('Detalle de carrito no encontrado');
      }
      await detalle.destroy();
      return true;
    } catch (error) {
      console.error('Error al eliminar detalle de carrito:', error);
      throw error;
    }
  }

  async findByCarritoIdWithDetails(idCarrito) {
    try {
      return await CarritoDetalle.findAll({
        where: { IdCarrito: idCarrito },
        include: [{
          model: Product,
          as: 'Producto',
          attributes: ['IdProducto', 'Nombre', 'IdTipoProducto', 'Precio']
        }]
      });
    } catch (error) {
      console.error('Error al obtener detalles del carrito con productos:', error);
      throw error;
    }
  }
}

module.exports = CarritoDetalleRepository;