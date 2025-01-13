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
              return_url: `http://localhost:5173`, // URL de redirección despues del pago exitoso
              cancel_url: `http://localhost:3000/api/payment/cancel`  // URL de redirección despues del pago cancelado
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
            approveUrl // URL para redireccionar al usuario
          };
        } catch (error) {
          console.error('Error al crear orden de PayPal:', error);
          throw error;
        }
      }
  
    async capturePayment(orderId) {
      try {
        // Obtener el pago de nuestra base de datos
        const pago = await PaymentRepository.findByPaypalOrderId(orderId);
        if (!pago) {
            throw new Error('Orden de pago no encontrada');
        }

        const montoActual = await this.calcularTotalPedido(pago.IdPedido);

        if (Math.abs(montoActual - parseFloat(pago.Monto)) > 0.01) {
            throw new Error('El monto del pedido ha cambiado');
        }
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        const capture = await this.client.execute(request);
  
        // Actualizar estado del pago y del carrito
        await sequelize.transaction(async (t) => {
          await PaymentRepository.updateStatus(orderId, 'COMPLETADO', t);
          await sequelize.query(`
            UPDATE carrito c
            JOIN pedido p ON c.IdCarrito = p.IdCarrito
            JOIN pago pg ON p.IdPedido = pg.IdPedido
            SET c.Estado = 'COMPRADO'
            WHERE pg.IdOrdenPaypal = :orderId
          `, {
            replacements: { orderId },
            transaction: t
          });
        });
  
        return capture.result;
      } catch (error) {
        console.error('Error al capturar pago de PayPal:', error);
        await PaymentRepository.updateStatus(orderId, 'FALLIDO');
        throw error;
      }
    }
  }
module.exports = new PaymentService();