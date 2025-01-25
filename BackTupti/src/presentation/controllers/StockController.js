const StockService = require('../../aplication/services/StockService');
const KardexRepository = require('../../infrastructure/repositories/KardexRepository');

const kardexRepository = new KardexRepository();
const stockService = new StockService(kardexRepository);

class StockController {
  constructor(stockService) {
    this.stockService = stockService;
  }

  async validateStock(req, res) {
    try {
      const { idProducto, cantidad } = req.body;
      const result = await this.stockService.validateStock(idProducto, cantidad);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

const stockController = new StockController(stockService);
module.exports = stockController;