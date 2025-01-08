const express = require('express');
const router = express.Router();
const descuentoController = require('../controllers/descuentoController');

/**
 * @swagger
 * /descuentos:
 *   post:
 *     summary: Crear un nuevo descuento
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
 * /descuentos/{id}:
 *   put:
 *     summary: Actualizar un descuento existente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Descuento actualizado
 */
router.put('/:id', (req, res) => descuentoController.updateDescuento(req, res));

/**
 * @swagger
 * /descuentos/carrito/{idCarrito}:
 *   get:
 *     summary: Calcular descuento total para un carrito
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

module.exports = router;