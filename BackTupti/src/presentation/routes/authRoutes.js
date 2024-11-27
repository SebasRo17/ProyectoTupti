const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

router.get('/google', (req, res, next) => AuthController.googleAuth(req, res, next));
router.get('/google/callback', (req, res, next) => AuthController.googleCallback(req, res, next));
router.get('/dashboard', (req, res) => AuthController.getDashboard(req, res));

module.exports = router;