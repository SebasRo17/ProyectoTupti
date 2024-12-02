// routes/bestSellers.routes.js
const express = require('express');
const router = express.Router();
const { getBestSellers } = require('../controllers/BestSellersController');

router.get('/best-sellers', getBestSellers);

module.exports = router;