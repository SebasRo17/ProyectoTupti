const express = require('express');
const router = express.Router();
const ProductController = require('../../presentation/controllers/ProductController');

/**
 * @swagger
 * /product-details/{idProducto}:
 *   get:
 *     summary: Obtener detalles del producto
 *     description: Devuelve el nombre del producto y el detalle del tipo de producto basado en el idProducto.
 *     parameters:
 *       - name: idProducto
 *         in: path
 *         description: ID del producto
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del producto obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Nombre:
 *                   type: string
 *                   example: "Producto A"
 *                 TipoProducto:
 *                   type: string
 *                   example: "Tipo A"
 *       500:
 *         description: Error al obtener detalles del producto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener detalles del producto"
 */
router.get('/:idProducto', (req, res) => ProductController.getProductDetails(req, res));

module.exports = router;