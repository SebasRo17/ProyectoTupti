const express = require('express');
const PedidoController = require('../controllers/PedidoController');

const router = express.Router();

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Crear un nuevo pedido
 *     tags:
 *       - Pedidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - IdUsuario
 *               - Direccion_IdDireccion
 *               - IdCarrito
 *             properties:
 *               IdUsuario:
 *                 type: integer
 *                 description: ID del usuario que realiza el pedido
 *               Direccion_IdDireccion:
 *                 type: integer
 *                 description: ID de la dirección asociada al pedido
 *               Estado:
 *                 type: integer
 *                 description: "Estado del pedido: 0=Espera, 1=Reembolsado, 2=Entregado"
 *                 enum: [0, 1, 2]
 *               IdCarrito:
 *                 type: integer
 *                 description: ID del carrito asociado al pedido
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', (req, res) => PedidoController.createPedido(req, res));

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Obtener un pedido por ID
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido a obtener
 *     responses:
 *       200:
 *         description: Pedido obtenido exitosamente
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', (req, res) => PedidoController.getPedido(req, res));

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Obtener todos los pedidos
 *     tags:
 *       - Pedidos
 *     responses:
 *       200:
 *         description: Lista de pedidos obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', (req, res) => PedidoController.getAllPedidos(req, res));

/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     summary: Actualizar un pedido por ID
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdUsuario:
 *                 type: integer
 *                 description: ID del usuario que realiza el pedido
 *               Direccion_IdDireccion:
 *                 type: integer
 *                 description: ID de la dirección asociada al pedido
 *               Estado:
 *                 type: integer
 *                 description: Estado del pedido
 *               IdCarrito:
 *                 type: integer
 *                 description: ID del carrito asociado al pedido
 *     responses:
 *       200:
 *         description: Pedido actualizado exitosamente
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', (req, res) => PedidoController.updatePedido(req, res));

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Eliminar un pedido por ID
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido a eliminar
 *     responses:
 *       200:
 *         description: Pedido eliminado exitosamente
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', (req, res) => PedidoController.deletePedido(req, res));

module.exports = router;
