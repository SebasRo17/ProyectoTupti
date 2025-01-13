const paypal = require('@paypal/checkout-server-sdk');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');
const PaymentRepository = require('../../infrastructure/repositories/paymentRepository');

class PaymentService {
    constructor() {
      const clientId = process.env.PAYPAL_CLIENT_ID;
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
      const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
      this.client = new paypal.core.PayPalHttpClient(environment);
    }
  
    async calcularTotalPedido(idPedido) {
      try {
        const result = await sequelize.query(`
          SELECT SUM(cd.Cantidad * cd.PrecioUnitario) as total
          FROM pedido p
          JOIN carrito c ON p.IdCarrito = c.IdCarrito
          JOIN carrito_detalle cd ON c.IdCarrito = cd.IdCarrito
          WHERE p.IdPedido = :idPedido
        `, {
          replacements: { idPedido },
          type: sequelize.QueryTypes.SELECT
        });
  
        return result[0].total || 0;
      } catch (error) {
        console.error('Error al calcular total del pedido:', error);
        throw error;
      }
    }
  
    async validarPedidoActivo(idPedido) {
      try {
        const result = await sequelize.query(`
          SELECT p.IdPedido, c.Estado as EstadoCarrito
          FROM pedido p
          JOIN carrito c ON p.IdCarrito = c.IdCarrito
          WHERE p.IdPedido = :idPedido
          AND c.Estado = 'ACTIVO'
        `, {
          replacements: { idPedido },
          type: sequelize.QueryTypes.SELECT
        });
  
        return result.length > 0;
      } catch (error) {
        console.error('Error al validar pedido:', error);
        throw error;
      }
    }
  
   // In PaymentService.js, modify the createOrder method
async createOrder(idPedido, monto) {
  try {
    const pedidoActivo = await this.validarPedidoActivo(idPedido);
    if (!pedidoActivo) {
      throw new Error('El pedido no está activo o no existe');
    }

    if (!monto || monto <= 0) {
      throw new Error('El monto proporcionado no es válido');
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: monto.toString()
        }
      }],
      application_context: {
        return_url: `${process.env.DEV_URL1}/payment-success`, // URL for successful payment
        cancel_url: `${process.env.DEV_URL1}/payment-cancel`,  // URL for cancelled payment
        user_action: 'PAY_NOW', // This forces the PayPal popup to show the payment button immediately
      }
    });
    const order = await this.client.execute(request);
    
    await PaymentRepository.create({
      IdOrdenPaypal: order.result.id,
      Monto: monto,
      IdPedido: idPedido
    });

    const approveUrl = order.result.links.find(link => link.rel === 'approve').href;

    return {
      orderId: order.result.id,
      total: monto,
      approveUrl
    };
  } catch (error) {
    console.error('Error al crear orden de PayPal:', error);
    throw error;
  }
}
  async capturePayment(orderId) {
    const transaction = await sequelize.transaction();
    
    try {
      // Get payment from database
      const pago = await PaymentRepository.findByPaypalOrderId(orderId);
      if (!pago) {
        throw new Error('Orden de pago no encontrada');
      }

      // Get PayPal order details
      const paypalOrder = await this.client.execute(
        new paypal.orders.OrdersGetRequest(orderId)
      );
      
      const paypalAmount = parseFloat(paypalOrder.result.purchase_units[0].amount.value);
      const storedAmount = parseFloat(pago.Monto);
      
      console.log('PayPal Amount:', paypalAmount);
      console.log('Stored Amount:', storedAmount);
      
      // Compare amounts with tolerance for floating point
      if (Math.abs(paypalAmount - storedAmount) > 0.01) {
        await transaction.rollback();
        throw new Error(`Montos no coinciden. PayPal: ${paypalAmount}, DB: ${storedAmount}`);
      }

      // Capture payment
      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      const capture = await this.client.execute(request);

      // Update payment and cart status
      await PaymentRepository.updateStatus(orderId, 'COMPLETADO', transaction);
      await sequelize.query(`
        UPDATE carrito c
        JOIN pedido p ON c.IdCarrito = p.IdCarrito
        JOIN pago pg ON p.IdPedido = pg.IdPedido
        SET c.Estado = 'COMPRADO'
        WHERE pg.IdOrdenPaypal = :orderId
      `, {
        replacements: { orderId },
        transaction
      });

      await transaction.commit();
      return capture.result;

    } catch (error) {
      await transaction.rollback();
      console.error('Error al capturar pago:', error);
      await PaymentRepository.updateStatus(orderId, 'FALLIDO');
      throw new Error(`Error en captura: ${error.message}`);
    }
  }
}
module.exports = new PaymentService();