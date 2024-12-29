const PedidoRepository = require('../../infrastructure/repositories/PedidoRepositoryImpl');

class PedidoService {
  async createPedido(pedidoData) {
    try {
      return await PedidoRepository.create(pedidoData);
    } catch (error) {
      console.error('Error en PedidoService - createPedido:', error);
      throw error;
    }
  }

  async getPedidoById(id) {
    try {
      return await PedidoRepository.findById(id);
    } catch (error) {
      console.error('Error en PedidoService - getPedidoById:', error);
      throw error;
    }
  }

  async getAllPedidos() {
    try {
      return await PedidoRepository.findAll();
    } catch (error) {
      console.error('Error en PedidoService - getAllPedidos:', error);
      throw error;
    }
  }

  async updatePedido(id, pedidoData) {
    try {
      return await PedidoRepository.update(id, pedidoData);
    } catch (error) {
      console.error('Error en PedidoService - updatePedido:', error);
      throw error;
    }
  }

  async deletePedido(id) {
    try {
      return await PedidoRepository.delete(id);
    } catch (error) {
      console.error('Error en PedidoService - deletePedido:', error);
      throw error;
    }
  }
}

module.exports = new PedidoService();
