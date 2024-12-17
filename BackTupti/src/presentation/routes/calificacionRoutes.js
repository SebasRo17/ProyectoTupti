const express = require('express');
const router = express.Router();
const CalificacionController = require('../controllers/CalificacionController');

router.post('/calificaciones', CalificacionController.createCalificacion);
router.get('/calificaciones/:idProducto', CalificacionController.getCalificaciones);

module.exports = router;
