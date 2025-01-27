const express = require('express');
const router = express.Router();
const facturaEmailController = require('../controllers/FacturaEmailController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/enviar', authMiddleware, facturaEmailController.enviarFactura);

module.exports = router;
