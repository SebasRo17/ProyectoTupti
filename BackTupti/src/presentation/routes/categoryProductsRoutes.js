const express = require('express');
const router = express.Router();
const { getCategoryProducts } = require('../controllers/CategoryProductController');

// Quitar el slash inicial ya que /api ya está definido en server.js
router.get('/cProducts/:id', getCategoryProducts);

module.exports = router;