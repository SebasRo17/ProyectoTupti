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
/**
 * @swagger
 * /producto-imagen/{idProductoImagen}:
 *   delete:
 *     summary: Elimina una imagen de producto existente
 *     tags: [ProductoImagen]
 *     parameters:
 *       - in: path
 *         name: idProductoImagen
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Imagen eliminada exitosamente
 *       404:
 *         description: Imagen no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:idProductoImagen', (req, res) => ProductoImagenController.deleteProductoImagen(req, res));
/**
 * @swagger
 * /producto-imagen/producto/{idProducto}:
 *   get:
 *     summary: Obtiene todas las imágenes de un producto específico
 *     tags: [ProductoImagen]
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de imágenes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   IdImagen:
 *                     type: integer
 *                   ImagenUrl:
 *                     type: string
 *       500:
 *         description: Error del servidor
 */
router.get('/producto/:idProducto', (req, res) => ProductoImagenController.getProductoImagenesByIdProducto(req, res));

module.exports = router;