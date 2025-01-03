const { sequelize } = require('../../infrastructure/database/mysqlConnection');
const PedidoRepository = require('../../infrastructure/repositories/PedidoRepository');

class PedidoService {
  async getPedidoDetails(idPedido) {
    try {
      const detalles = await PedidoRepository.findPedidoDetailsById(idPedido);
      
      if (!detalles.length) {
        throw new Error('Pedido no encontrado');
      }

      // Calcular totales y organizar la respuesta
      const resumen = {
        idPedido: detalles[0].IdPedido,
        items: detalles.map(item => ({
          idCarritoDetalle: item.IdCarritoDetalle,
          producto: {
            nombre: item.NombreProducto,
            precio: parseFloat(item.PrecioProducto),
            cantidad: item.Cantidad,
            precioUnitario: parseFloat(item.PrecioUnitario),
            subtotal: parseFloat(item.PrecioUnitario) * item.Cantidad
          },
          impuesto: {
            nombre: item.NombreImpuesto,
            porcentaje: parseFloat(item.PorcentajeImpuesto)
          }
        })),
        totales: {
          subtotal: detalles.reduce((acc, item) => 
            acc + (parseFloat(item.PrecioUnitario) * item.Cantidad), 0),
          cantidadItems: detalles.reduce((acc, item) => acc + item.Cantidad, 0)
        }
      };

      // Calcular impuestos totales
      resumen.totales.impuestos = detalles.reduce((acc, item) => {
        const subtotalItem = parseFloat(item.PrecioUnitario) * item.Cantidad;
        return acc + (subtotalItem * parseFloat(item.PorcentajeImpuesto) / 100);
      }, 0);

      // Calcular total final
      resumen.totales.total = resumen.totales.subtotal + resumen.totales.impuestos;

      return resumen;
    } catch (error) {
      console.error('Error en el servicio de pedidos:', error);
      throw error;
    }
  }
}

module.exports = new PedidoService();