const express = require('express');
const router = express.Router();
const stockController = require('../controllers/StockController');

/**
 * @swagger
 * /api/stock/validate:
 *   post:
 *     summary: Validar stock disponible
 *     tags: [Stock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idProducto:
 *                 type: integer
 *                 description: ID del producto
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad solicitada
 *     responses:
 *       200:
 *         description: Stock validado correctamente
 *       400:
 *         description: Stock insuficiente o error en la validación
 */
router.post('/validate', (req, res) => stockController.validateStock(req, res));

module.exports = router;