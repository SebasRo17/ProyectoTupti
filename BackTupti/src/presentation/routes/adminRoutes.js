const express = require('express');
const { loginAdmin } = require('../controllers/AdminController'); // Importa el controlador correcto
const router = express.Router();

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Iniciar sesión como administrador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error del servidor
 */
router.post('/loginAdm', loginAdmin); // Usa el controlador correcto

module.exports = router;