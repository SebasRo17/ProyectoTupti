const express = require('express');
const TipoProductoController = require('../controllers/TipoProductoController');
const router = express.Router();

/**
 * @swagger
 * /tipoproductos:
 *   get:
 *     summary: Obtiene todos los tipos de producto
 *     tags: [TipoProductos]
 *     responses:
 *       200:
 *         description: Lista de tipos de producto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   IdTipoProducto:
 *                     type: integer
 *                   detalle:
 *                     type: string
 *       500:
 *         description: Error del servidor
 */
router.get('/', (req, res) => TipoProductoController.getAllTipoProductos(req, res));

module.exports = router;