const PaymentService = require('../../aplication/services/paymentService');

class PaymentController {
  async createPaymentOrder(req, res) {
    try {
      const { idPedido, monto } = req.body;
      if (!idPedido) {
        return res.status(400).json({ message: 'IdPedido es requerido' });
      }
      if (!monto || monto <= 0) {
        return res.status(400).json({ message: 'Monto es requerido y debe ser mayor que 0' });
      }

      const order = await PaymentService.createOrder(idPedido, monto);
      res.json(order);
    } catch (error) {
      console.error('Error al crear orden de pago:', error);
      res.status(500).json({ message: error.message || 'Error al crear orden de pago' });
    }
  }

  async capturePayment(req, res) {
    try {
      const { orderId } = req.params;
      const captureData = await PaymentService.capturePayment(orderId);
      res.json(captureData);
    } catch (error) {
      console.error('Error al capturar pago:', error);
      res.status(500).json({ message: error.message || 'Error al procesar el pago' });
    }
  }
}

module.exports = new PaymentController();