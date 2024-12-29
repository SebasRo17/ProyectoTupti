const Pedido = require('../../domain/models/Pedido');

class PedidoRepositoryImpl {
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
  
  module.exports = new PedidoRepositoryImpl();