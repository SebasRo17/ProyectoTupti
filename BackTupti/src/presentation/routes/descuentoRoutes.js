const express = require('express');
const router = express.Router();
const descuentoController = require('../controllers/DescuentoController');

/**
 * @swagger
 * /descuentos:
 *   post:
 *     summary: Crear un nuevo descuento
 *     tags: [Descuentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdTipoProducto:
 *                 type: integer
 *               IdProducto:
 *                 type: integer
 *               Porcentaje:
 *                 type: string
 *               FechaInicio:
 *                 type: string
 *                 format: date-time
 *               FechaFin:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Descuento creado
 */
router.post('/', (req, res) => descuentoController.createDescuento(req, res));

/**
 * @swagger
 * /descuentos/carrito/{idCarrito}:
 *   get:
 *     summary: Calcular descuento total para un carrito
 *     tags: [Descuentos]
 *     parameters:
 *       - name: idCarrito
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Descuento total calculado
 */
router.get('/carrito/:idCarrito', (req, res) => descuentoController.getCarritoDescuento(req, res));
/**
 * @swagger
 * /descuentos:
 *   get:
 *     summary: Obtener todos los descuentos
 *     tags: [Descuentos]
 *     description: Retorna lista de descuentos con nombre del producto/categoría y estado
 *     responses:
 *       200:
 *         description: Lista de descuentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     description: Nombre del producto o categoría
 *                   estado:
 *                     type: boolean
 *                     description: Estado del descuento basado en fechas
 *                   porcentaje:
 *                     type: string
 *                     description: Porcentaje del descuento
 *                   fechaInicio:
 *                     type: string
 *                     format: date-time
 *                   fechaFin:
 *                     type: string
 *                     format: date-time
 */
router.get('/', (req, res) => descuentoController.getAllDiscounts(req, res));

/**
 * @swagger
 * /descuentos/{id}:
 *   put:
 *     summary: Actualizar un descuento existente
 *     tags: [Descuentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del descuento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               porcentaje:
 *                 type: string
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *               fechaFin:
 *                 type: string
 *                 format: date
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Descuento actualizado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
router.put('/:id', (req, res) => descuentoController.updateDiscount(req, res));
/**
 * @swagger
 * /descuentos/{id}:
 *   delete:
 *     summary: Elimina un descuento por ID
 *     tags: [Descuentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del descuento
 *     responses:
 *       200:
 *         description: Descuento eliminado correctamente
 *       404:
 *         description: Descuento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', (req, res) => descuentoController.deleteDescuentoById(req, res));

module.exports = router;