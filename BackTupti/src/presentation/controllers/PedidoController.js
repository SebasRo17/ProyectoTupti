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
}

module.exports = new PedidoController();