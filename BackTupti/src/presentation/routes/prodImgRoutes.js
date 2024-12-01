const express = require('express');
const router = express.Router();
const { getProductImages } = require('../controllers/ProductImgController');

/**
 * @swagger
 * /producto/{id}/imagenes:
 *   get:
 *     summary: Obtiene las imágenes de un producto específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de URLs de imágenes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   IdImagen:
 *                     type: integer
 *                   IdProducto:
 *                     type: integer
 *                   ImagenURL:
 *                     type: string
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error en el servidor
 */

router.get('/producto/:id/imagenes', getProductImages);

module.exports = router;