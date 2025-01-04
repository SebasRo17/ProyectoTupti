const { sequelize } = require('../database/mysqlConnection');

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
          imp.Porcentaje as PorcentajeImpuesto
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
}

module.exports = new PedidoRepository();