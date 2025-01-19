const express = require('express');
const CarritoController = require('../controllers/CarritoController');
const router = express.Router();

/**
 * @swagger
 * /carrito/agregar-producto:
 *   post:
 *     summary: Agregar producto al carrito
 *     tags: [Carrito]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idUsuario
 *               - idProducto
 *               - cantidad
 *             properties:
 *               idUsuario:
 *                 type: integer
 *                 description: ID del usuario
 *               idProducto:
 *                 type: integer
 *                 description: ID del producto
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad del producto
 *     responses:
 *       200:
 *         description: Producto agregado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/agregar-producto', (req, res) => CarritoController.agregarProductoACarrito(req, res));
/**
 * @swagger
 * /carrito/{id}/estado:
 *   patch:
 *     summary: Actualizar el estado de un carrito
 *     tags: [Carrito]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [COMPRADO, ABANDONADO]
 *     responses:
 *       200:
 *         description: Estado del carrito actualizado
 *       400:
 *         description: Solicitud inválida
 *       404:
 *         description: Carrito no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.patch('/:id/estado', (req, res) => CarritoController.actualizarEstado(req, res));

/**
 * @swagger
 * /carrito/{idUsuario}:
 *   get:
 *     summary: Obtener carrito activo de un usuario
 *     tags: [Carrito]
 *     parameters:
 *       - name: idUsuario
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carrito activo del usuario
 *       404:
 *         description: No se encontró carrito activo
 *       500:
 *         description: Error del servidor
 */
router.get('/:idUsuario', (req, res) => CarritoController.getActiveCarritoByUserId(req, res));
/**
 * @swagger
 * /carrito/{idCarrito}/totales:
 *   get:
 *     summary: Obtiene los totales e impuestos del carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: idCarrito
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Totales calculados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subtotal:
 *                   type: number
 *                 impuestoTotal:
 *                   type: number
 *                 total:
 *                   type: number
 *       500:
 *         description: Error del servidor
 */
router.get('/:idCarrito/totales', (req, res) => CarritoController.obtenerTotalesCarrito(req, res));
  
module.exports = router;