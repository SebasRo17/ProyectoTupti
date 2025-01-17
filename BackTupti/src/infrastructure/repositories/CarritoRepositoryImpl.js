const Carrito = require('../../domain/models/Carrito');
const CarritoDetalle = require('../../domain/models/CarritoDetalle');
const Producto = require('../../domain/models/Producto');
const ProductoImagen = require('../../domain/models/ProductoImagen');
const Impuesto = require('../../domain/models/Impuesto');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');
const { Op } = require('sequelize'); 

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
            [Op.gt]: 0 // Greater Than 0
          }
        },
        include: [
          {
            model: Producto,
            as: 'Producto',
            include: [
              {
                model: ProductoImagen,
                as: 'Imagenes',
                limit: 1 // Limitar a solo una imagen
              }
            ]
          }
        ]
      });

      // Procesar los resultados para incluir solo la primera imagen como campo extra
      const detallesConPrimeraImagen = carritoDetalles.map(detalle => {
        const producto = detalle.Producto;
        const primeraImagen = producto.Imagenes.length > 0 ? producto.Imagenes[0].ImagenUrl : null;
        const productoData = producto.toJSON();
        delete productoData.Imagenes; // Eliminar el array de imágenes
        return {
          ...detalle.toJSON(),
          Producto: {
            ...productoData,
            ImagenUrl: primeraImagen // Incluir la primera imagen como campo extra
          }
        };
      });

      return {
        carrito,
        detalles: detallesConPrimeraImagen
      };
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      throw error;
    }
  }
  async obtenerDetallesConImpuestos(idCarrito) {
    try {
      const detalles = await sequelize.query(`
        SELECT 
          cd.IdCarritoDetalle,
          cd.IdProducto,
          cd.Cantidad,
          cd.PrecioUnitario,
          p.Nombre as NombreProducto,
          i.Porcentaje as PorcentajeImpuesto,
          i.Nombre as NombreImpuesto,
          i.Tipo as TipoImpuesto,
          i.CodigoIVA,
          i.CodigoICE,
          (cd.PrecioUnitario * cd.Cantidad) as Subtotal,
          (cd.PrecioUnitario * cd.Cantidad * i.Porcentaje / 100) as MontoImpuesto
        FROM carrito_detalle cd
        INNER JOIN producto p ON cd.IdProducto = p.IdProducto
        INNER JOIN Impuesto i ON p.IdImpuesto = i.IdImpuesto
        WHERE cd.IdCarrito = :idCarrito
        AND i.Aplicable = 1
      `, {
        replacements: { idCarrito },
        type: sequelize.QueryTypes.SELECT
      });
  
      if (!detalles.length) {
        throw new Error('No se encontraron detalles para el carrito');
      }
  
      return detalles;
    } catch (error) {
      console.error('Error en repositorio:', error);
      throw error;
    }
  }
}

module.exports = new CarritoRepositoryImpl();