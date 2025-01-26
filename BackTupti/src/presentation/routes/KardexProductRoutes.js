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

module.exports = router;