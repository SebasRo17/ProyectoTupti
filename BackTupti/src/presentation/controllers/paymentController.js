const PaymentService = require('../../aplication/services/paymentService');

class PaymentController {
    async createPaymentOrder(req, res) {
      try {
        const { idPedido } = req.body;
        if (!idPedido) {
          return res.status(400).json({ message: 'IdPedido es requerido' });
        }
  
        const order = await PaymentService.createOrder(idPedido);
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