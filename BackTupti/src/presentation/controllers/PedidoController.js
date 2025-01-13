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
  async createPedido(req, res) {
    try {
      const pedido = await PedidoService.createPedido(req.body);
      res.status(201).json(pedido);
    } catch (error) {
      console.error('Error en PedidoController - createPedido:', error);
      res.status(500).json({ message: 'Error al crear el pedido' });
    }
  }
  async getPedido(req, res) {
    try {
      const pedido = await PedidoService.getPedidoById(req.params.id);
      if (!pedido) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
      res.status(200).json(pedido);
    } catch (error) {
      console.error('Error en PedidoController - getPedido:', error);
      res.status(500).json({ message: 'Error al obtener el pedido' });
    }
  }
  async getAllPedidos(req, res) {
    try {
      const pedidos = await PedidoService.getAllPedidos();
      res.status(200).json(pedidos);
    } catch (error) {
      console.error('Error en PedidoController - getAllPedidos:', error);
      res.status(500).json({ message: 'Error al obtener los pedidos' });
    }
  }
  async updatePedido(req, res) {
    try {
      const updated = await PedidoService.updatePedido(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
      res.status(200).json({ message: 'Pedido actualizado exitosamente' });
    } catch (error) {
      console.error('Error en PedidoController - updatePedido:', error);
      res.status(500).json({ message: 'Error al actualizar el pedido' });
    }
  }
  async deletePedido(req, res) {
    try {
      const deleted = await PedidoService.deletePedido(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
      res.status(200).json({ message: 'Pedido eliminado exitosamente' });
    } catch (error) {
      console.error('Error en PedidoController - deletePedido:', error);
      res.status(500).json({ message: 'Error al eliminar el pedido' });
    }
  }
}

module.exports = new PedidoController();