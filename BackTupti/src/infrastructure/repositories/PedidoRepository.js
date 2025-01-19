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
          imp.Nombre as NombreImpuesto,
          imp.Porcentaje as PorcentajeImpuesto,
          COALESCE(d.Porcentaje, 0) as PorcentajeDescuento
        FROM pedido p
        JOIN carrito_detalle cd ON p.IdCarrito = cd.IdCarrito
        JOIN producto prod ON cd.IdProducto = prod.IdProducto
        JOIN Impuesto imp ON prod.IdImpuesto = imp.IdImpuesto
        LEFT JOIN descuento d ON prod.IdProducto = d.IdProducto AND d.Activo = 1 AND NOW() BETWEEN d.FechaInicio AND d.FechaFin
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
}

module.exports = new PedidoRepository();