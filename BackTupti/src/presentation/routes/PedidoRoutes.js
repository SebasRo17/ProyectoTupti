const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/PedidoController');

/**
 * @swagger
 * /pedidos/{idPedido}/detalles:
 *   get:
 *     summary: Obtener detalles completos de un pedido
 *     parameters:
 *       - in: path
 *         name: idPedido
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Detalles del pedido
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:idPedido/detalles', (req, res) => PedidoController.getPedidoDetails(req, res));

/**
 * @swagger
 * /pedidos/carrito/{idCarrito}:
 *   get:
 *     summary: Obtener pedido por ID de carrito
 *     parameters:
 *       - in: path
 *         name: idCarrito
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: No existe pedido para este carrito
 *       500:
 *         description: Error del servidor
 */
router.get('/carrito/:idCarrito', (req, res) => PedidoController.getPedidoByCarrito(req, res));

module.exports = router;