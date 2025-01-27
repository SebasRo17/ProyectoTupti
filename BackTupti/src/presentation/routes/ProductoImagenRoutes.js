const express = require('express');
const ProductoImagenController = require('../controllers/ProductoImagenController');
const router = express.Router();

/**
 * @swagger
 * /producto-imagen:
 *   post:
 *     summary: Agrega una nueva imagen de producto
 *     tags: [ProductoImagen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdProducto:
 *                 type: integer
 *               ImagenUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Imagen de producto creada exitosamente
 *       500:
 *         description: Error del servidor
 */
router.post('', (req, res) => ProductoImagenController.createProductoImagen(req, res));

module.exports = router;