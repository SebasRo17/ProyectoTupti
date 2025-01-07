const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     summary: Crear una orden de pago con PayPal
 *     tags: [PayPal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idPedido:
 *                 type: integer
 *               monto:
 *                 type: number
 *     responses:
 *       200:
 *         description: Orden de pago creada exitosamente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
router.post('/create', (req, res) => PaymentController.createPaymentOrder(req, res));

/**
 * @swagger
 * /api/payments/capture/{orderId}:
 *   post:
 *     summary: Capturar un pago de PayPal
 *     tags: [PayPal]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pago capturado exitosamente
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error del servidor
 */
router.post('/capture/:orderId', (req, res) => PaymentController.capturePayment(req, res));

module.exports = router;