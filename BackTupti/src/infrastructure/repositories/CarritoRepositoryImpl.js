const Carrito = require('../../domain/models/Carrito');
const CarritoDetalle = require('../../domain/models/CarritoDetalle');
const Producto = require('../../domain/models/Producto');

class CarritoRepositoryImpl {
  async buscarCarritoActivoPorUsuario(idUsuario) {
    return await Carrito.findOne({
      where: {
        IdUsuario: idUsuario,
        Estado: 'ACTIVO'
      }
    });
  }

  async crearCarrito(idUsuario) {
    return await Carrito.create({
      IdUsuario: idUsuario,
      Estado: 'ACTIVO'
    });
  }

  async agregarProductoACarrito(carritoDetalle) {
    return await CarritoDetalle.create(carritoDetalle);
  }

  async buscarDetalleCarritoPorProducto(idCarrito, idProducto) {
    return await CarritoDetalle.findOne({
      where: {
        IdCarrito: idCarrito,
        IdProducto: idProducto
      }
    });
  }

  async actualizarCantidadDetalleCarrito(idCarritoDetalle, cantidad) {
    return await CarritoDetalle.update(
      { Cantidad: cantidad },
      { where: { IdCarritoDetalle: idCarritoDetalle } }
    );
  }

  async updateEstado(IdCarrito, nuevoEstado) {
    try {
      const result = await Carrito.update(
        { Estado: nuevoEstado },
        { where: { IdCarrito } }
      );
      return result[0]; // Retorna el número de filas afectadas
    } catch (error) {
      console.error('Error al actualizar el estado del carrito:', error);
      throw error;
    }
  }
  async findActiveCarritoByUserId(idUsuario) {
    try {
      // Buscar carrito activo del usuario
      const carrito = await Carrito.findOne({
        where: { 
          IdUsuario: idUsuario, 
          Estado: 'ACTIVO' 
        }
      });

      if (!carrito) {
        return null;
      }

      // Buscar detalles del carrito con cantidad mayor a 0
      const carritoDetalles = await CarritoDetalle.findAll({
        where: { 
          IdCarrito: carrito.IdCarrito,
          Cantidad: {
            [require('sequelize').Op.gt]: 0 // Greater Than 0
          }
        },
        include: [
          {
            model: Producto,
            as: 'Producto'
          }
        ]
      });

      return {
        carrito,
        detalles: carritoDetalles
      };
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      throw error;
    }
  }
}

module.exports = new CarritoRepositoryImpl();