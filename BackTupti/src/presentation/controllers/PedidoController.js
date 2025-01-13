const PedidoService = require('../../aplication/services/PedidoService');

class PedidoController {
  async getPedidoDetails(req, res) {
    try {
      const { idPedido } = req.params;
      const detalles = await PedidoService.getPedidoDetails(idPedido);
      res.json(detalles);
    } catch (error) {
      console.error('Error en el controlador de pedidos:', error);
      if (error.message === 'Pedido no encontrado') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error al obtener detalles del pedido' });
      }
    }
  }
  async getPedidoByCarrito(req, res) {
    try {
      const { idCarrito } = req.params;
      const pedido = await PedidoService.getPedidoByCarrito(idCarrito);
      res.json(pedido);
    } catch (error) {
      console.error('Error en el controlador de pedidos:', error);
      if (error.message === 'Pedido no encontrado para este carrito') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error al buscar el pedido' });
      }
    }
  }
}

module.exports = new PedidoController();