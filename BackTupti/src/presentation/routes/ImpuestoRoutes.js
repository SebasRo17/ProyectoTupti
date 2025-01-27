const express = require('express');
const ImpuestoController = require('../controllers/ImpuestoController');
const router = express.Router();

/**
 * @swagger
 * /impuestos:
 *   get:
 *     summary: Obtiene todos los impuestos
 *     tags: [Impuestos]
 *     responses:
 *       200:
 *         description: Lista de impuestos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   IdImpuesto:
 *                     type: integer
 *                   Nombre:
 *                     type: string
 *                   Porcentaje:
 *                     type: number
 *       500:
 *         description: Error del servidor
 */
router.get('/', (req, res) => ImpuestoController.getAllImpuestos(req, res));

module.exports = router;