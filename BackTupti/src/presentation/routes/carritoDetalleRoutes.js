const express = require('express');
const router = express.Router();
const CarritoDetalleController = require('../controllers/CarritoDetalleController');

/**
 * @swagger
 * /carrito-detalle/{id}:
 *   delete:
 *     summary: Eliminar un detalle del carrito
 *     tags: [CarritoDetalle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle del carrito
 *     responses:
 *       200:
 *         description: Detalle eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Detalle no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', (req, res) => CarritoDetalleController.deleteDetalle(req, res));

module.exports = router;