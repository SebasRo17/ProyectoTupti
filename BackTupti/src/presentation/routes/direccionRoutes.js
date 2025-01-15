const express = require('express');
const DireccionController = require('../controllers/DireccionController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Direccion:
 *       type: object
 *       required:
 *         - IdUsuario
 *         - CallePrincipal
 *         - Ciudad
 *         - Provincia
 *         - Pais
 *       properties:
 *         IdUsuario:
 *           type: integer
 *           description: ID del usuario al que pertenece la dirección
 *         CallePrincipal:
 *           type: string
 *           description: Nombre de la calle principal
 *         Numeracion:
 *           type: string // Asegúrate de que sea de tipo string
 *           description: Número de casa o edificio
 *         CalleSecundaria:
 *           type: string
 *           description: Nombre de la calle secundaria
 *         Vecindario:
 *           type: string
 *           description: Nombre del barrio o vecindario
 *         Ciudad:
 *           type: string
 *           description: Nombre de la ciudad
 *         Provincia:
 *           type: string
 *           description: Nombre de la provincia
 *         Pais:
 *           type: string
 *           description: Nombre del país
 *         Descripcion:
 *           type: string
 *           description: Descripción de la dirección
 * 
 * /direcciones:
 *   post:
 *     summary: Crear nueva dirección
 *     tags:
 *       - Direcciones
 *     description: Crea una nueva dirección para un usuario. El usuario puede tener máximo 5 direcciones.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Direccion'
 *     responses:
 *       201:
 *         description: Dirección creada exitosamente
 *       400:
 *         description: Error de validación o límite de direcciones alcanzado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post('/', (req, res) => DireccionController.createDireccion(req, res));

/**
 * @swagger
 * /direcciones/{id}:
 *   delete:
 *     summary: Eliminar dirección por ID
 *     tags:
 *       - Direcciones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la dirección a eliminar
 *     responses:
 *       200:
 *         description: Dirección eliminada exitosamente
 *       404:
 *         description: Dirección no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', (req, res) => DireccionController.deleteDireccion(req, res));

/**
 * @swagger
 * /direcciones/usuario/{userId}:
 *   get:
 *     summary: Obtener todas las direcciones de un usuario
 *     tags:
 *       - Direcciones
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario cuyas direcciones se obtendrán
 *     responses:
 *       200:
 *         description: Lista de direcciones obtenidas exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/usuario/:userId', (req, res) => DireccionController.getDireccionesByUserId(req, res));

/**
 * @swagger
 * /direcciones/{id}:
 *   put:
 *     summary: Actualizar una dirección por ID
 *     tags:
 *       - Direcciones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la dirección a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CallePrincipal
 *               - Ciudad
 *               - Provincia
 *               - Pais
 *             properties:
 *               CallePrincipal:
 *                 type: string
 *                 description: Nueva calle principal de la dirección
 *               Ciudad:
 *                 type: string
 *                 description: Nueva ciudad de la dirección
 *               Provincia:
 *                 type: string
 *                 description: Nueva provincia de la dirección
 *               Pais:
 *                 type: string
 *                 description: Nuevo país de la dirección
 *               Numeracion:
 *                 type: string // Asegúrate de que sea de tipo string
 *                 description: Nueva numeración de la dirección
 *               Descripcion:
 *                 type: string
 *                 description: Nueva descripción de la dirección
 *     responses:
 *       200:
 *         description: Dirección actualizada exitosamente
 *       400:
 *         description: Datos incorrectos o incompletos
 *       404:
 *         description: Dirección no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', (req, res) => DireccionController.updateDireccion(req, res));
/**
 * @swagger
 * /direcciones/{idDireccion}/seleccionar:
 *   put:
 *     summary: Actualiza la dirección seleccionada del usuario
 *     tags: [Direcciones]
 *     parameters:
 *       - in: path
 *         name: idDireccion
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la dirección a seleccionar
 *     responses:
 *       200:
 *         description: Dirección seleccionada actualizada exitosamente
 *       404:
 *         description: Dirección no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:idDireccion/seleccionar', (req, res) => DireccionController.updateSelectedAddress(req, res));
module.exports = router;