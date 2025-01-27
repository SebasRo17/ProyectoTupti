const express = require('express');
const ProductController = require('../controllers/ProductController');
const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtiene un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', ProductController.getProducts);


/**
 * @swagger
 * /:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *               Precio:
 *                 type: number
 *               Descripcion:
 *                 type: string
 *               IdTipoProducto:
 *                 type: integer
 *               Stock:
 *                 type: integer
 *               IdImpuesto:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error al crear el producto
 */
router.post('', (req, res) => ProductController.createProduct(req, res));



/**
 * @swagger
 * /products/{idProducto}:
 *   patch:
 *     summary: Actualizar parcialmente un producto (nombre, precio y descripción)
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         required: true
 *         description: ID del producto a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nuevo nombre del producto
 *               precio:
 *                 type: number
 *                 format: float
 *                 description: Nuevo precio del producto
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción del producto
 *             example:
 *               nombre: "Producto Actualizado"
 *               precio: 99.99
 *               descripcion: "Nueva descripción del producto"
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 IdProducto:
 *                   type: integer
 *                 Nombre:
 *                   type: string
 *                 Precio:
 *                   type: number
 *                 Descripcion:
 *                   type: string
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.patch('/:idProducto', (req, res) => ProductController.updatePartialProduct(req, res));

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Elimina un producto existente
 *     tags: [Producto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Producto eliminado exitosamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', (req, res) => ProductController.deleteProducto(req, res));

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener productos con filtros opcionales
 *     parameters:
 *       - name: Nombre
 *         in: query
 *         description: Nombre del producto (opcional)
 *         required: false
 *         schema:
 *           type: string
 *       - name: PrecioMin
 *         in: query
 *         description: Precio mínimo (opcional)
 *         required: false
 *         schema:
 *           type: number
 *       - name: PrecioMax
 *         in: query
 *         description: Precio máximo (opcional)
 *         required: false
 *         schema:
 *           type: number
 *       - name: IdTipoProducto
 *         in: query
 *         description: ID del tipo de producto (opcional)
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de productos (todos o filtrados)
 *       500:
 *         description: Error del servidor
 */
router.get('/', (req, res) => ProductController.getProducts(req, res));

module.exports = router;