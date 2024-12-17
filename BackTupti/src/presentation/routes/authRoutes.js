const express = require('express');
const passport = require('passport'); // Importar passport
const router = express.Router();
const authController = require('./../controllers/AuthController');


// Rutas de autenticación con Google
router.get('/google', authController.googleLogin);
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), authController.googleCallback);

// Rutas de autenticación con Facebook
router.get('/facebook', authController.facebookLogin);
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), authController.facebookCallback);

// Ruta protegida del dashboard

module.exports = router;