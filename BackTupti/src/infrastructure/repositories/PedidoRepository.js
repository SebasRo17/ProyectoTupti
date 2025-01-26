const { sequelize } = require('../database/mysqlConnection');
const Pedido = require('../../domain/models/Pedido');

class PedidoRepository {
  async findPedidoDetailsById(idPedido) {
    try {
      const query = `
        SELECT 
          p.IdPedido,
          cd.IdCarritoDetalle,
          cd.Cantidad,
          cd.PrecioUnitario,
          prod.Nombre as NombreProducto,
          prod.Precio as PrecioProducto,
          prod.IdTipoProducto,
          imp.Nombre as NombreImpuesto,
          imp.Porcentaje as PorcentajeImpuesto,
          COALESCE(
            (SELECT Porcentaje 
             FROM descuento 
             WHERE (IdProducto = prod.IdProducto OR IdTipoProducto = prod.IdTipoProducto)
             AND Activo = 1 
             AND NOW() BETWEEN FechaInicio AND FechaFin
             LIMIT 1
            ), 0) as PorcentajeDescuento,
          ROUND(prod.Precio * cd.Cantidad * (imp.Porcentaje / 100), 2) as MontoImpuesto
        FROM pedido p
        JOIN carrito_detalle cd ON p.IdCarrito = cd.IdCarrito
        JOIN producto prod ON cd.IdProducto = prod.IdProducto
        JOIN Impuesto imp ON prod.IdImpuesto = imp.IdImpuesto
        WHERE p.IdPedido = :idPedido
      `;
  
      const result = await sequelize.query(query, {
        replacements: { idPedido },
        type: sequelize.QueryTypes.SELECT
      });
  
      return result;
    } catch (error) {
      console.error('Error en el repositorio al obtener detalles del pedido:', error);
      throw error;
    }
  }
  async findByCarritoId(idCarrito) {
    try {
      const query = `
        SELECT 
          IdPedido,
          IdUsuario,
          Direccion_IdDireccion,
          Estado,
          IdCarrito
        FROM pedido
        WHERE IdCarrito = :idCarrito
      `;

      const result = await sequelize.query(query, {
        replacements: { idCarrito },
        type: sequelize.QueryTypes.SELECT
      });

      return result[0]; // Devolvemos el primer resultado ya que IdCarrito es UNIQUE
    } catch (error) {
      console.error('Error en el repositorio al buscar pedido por carrito:', error);
      throw error;
    }
  }

  async create(pedidoData) {
    return await Pedido.create(pedidoData);
  }

  async findById(id) {
    return await Pedido.findByPk(id);
  }

  async findAll() {
    return await Pedido.findAll();
  }

  async update(id, data) {
    const pedido = await Pedido.findByPk(id);
    if (pedido) {
      return await pedido.update(data);
    }
    return null;
  }

  async delete(id) {
    return await Pedido.destroy({ where: { IdPedido: id } });
  }

  async findLastByUserId(idUsuario) {
    try {
      const pedido = await Pedido.findOne({
        where: { IdUsuario: idUsuario },
        order: [['IdPedido', 'DESC']]
      });
      return pedido;
    } catch (error) {
      console.error('Error al buscar último pedido:', error);
      throw error;
    }
  }

  async findPedidoFullDetails(idPedido) {
    try {
      const query = `
        SELECT 
          u.Nombre,
          u.Email,
          d.CallePrincipal,
          d.Numeracion, 
          d.CalleSecundaria,
          d.Vecindario,
          d.Ciudad,
          p.IdPedido,
          p.Estado,
          c.updatedAt as CarritoFecha,
          cd.IdProducto,
          cd.Cantidad,
          cd.PrecioUnitario,
          prod.Nombre as NombreProducto
        FROM pedido p
        JOIN usuario u ON p.IdUsuario = u.IdUsuario
        JOIN direccion d ON p.Direccion_IdDireccion = d.IdDireccion
        JOIN carrito c ON p.IdCarrito = c.IdCarrito
        JOIN carrito_detalle cd ON c.IdCarrito = cd.IdCarrito
        JOIN producto prod ON cd.IdProducto = prod.IdProducto
        WHERE p.IdPedido = :idPedido
      `;

      return await sequelize.query(query, {
        replacements: { idPedido },
        type: sequelize.QueryTypes.SELECT
      });
    } catch (error) {
      console.error('Error en el repositorio al obtener detalles completos del pedido:', error);
      throw error;
    }
  }
}

module.exports = new PedidoRepository();