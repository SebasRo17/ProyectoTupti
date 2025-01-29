const express = require('express');
const router = express.Router();
const FacturaController = require('../controllers/FacturaController');

router.get('/usuario/:idUsuario', FacturaController.getFacturasByUsuario);
router.get('/download/:id', FacturaController.downloadFacturaPDF);

module.exports = router;
