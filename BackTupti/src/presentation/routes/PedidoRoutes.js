const express = require('express');
const router = express.Router(); // Definir router
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
module.exports = router; 