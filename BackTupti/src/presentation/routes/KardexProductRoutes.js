const express = require('express');
const router = express.Router();
const KardexProductController = require('../controllers/KardexProductController');

/**
 * @swagger
 * /kardex-product:
 *   post:
 *     summary: Crear nuevo registro de kardex
 *     tags: [Kardex]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idProducto
 *               - movimiento
 *               - cantidad
 *             properties:
 *               idProducto:
 *                 type: integer
 *                 description: ID del producto
 *               movimiento:
 *                 type: string
 *                 description: Tipo de movimiento (ENTRADA/SALIDA)
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad del movimiento
 *     responses:
 *       201:
 *         description: Kardex creado exitosamente
 *       500:
 *         description: Error del servidor
 */
router.post('/', (req, res) => KardexProductController.createKardex(req, res));
/**
 * @swagger
 * /kardex-product/sum/{idProducto}:
 *   get:
 *     summary: Suma la cantidad de todos los registros de KardexProduct con un IdProducto específico
 *     tags: [KardexProduct]
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Suma de la cantidad obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCantidad:
 *                   type: integer
 *       500:
 *         description: Error del servidor
 */
router.get('/sum/:idProducto', (req, res) => KardexProductController.sumCantidadByIdProducto(req, res));

module.exports = router;