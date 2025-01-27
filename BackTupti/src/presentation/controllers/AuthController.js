require('dotenv').config();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('./../../domain/models/User');
const AuthService = require('../../aplication/services/AuthService');
const redirectURL = process.env.NODE_ENV === 'production' ? process.env.PROD_URL1 : process.env.DEV_URL1;

const AuthController = {
  // Ruta para iniciar sesión con Google
  googleLogin: (req, res, next) => {
    const redirectUrl = req.query.redirect || `${redirectURL}`;
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: redirectUrl
    })(req, res, next);
  },

  // Ruta de callback de Google
  googleCallback: (req, res) => {
    const redirectUrl = req.query.state || `${redirectURL}`;

    // Usar el usuario del objeto req.user
    const userData = req.user.user;
    const token = AuthService.generateToken(userData);

    const script = `
      <script>
        window.opener.postMessage({ token: '${token}' }, '${redirectUrl}');
        window.close();
      </script>
    `;
    res.send(script);
  },

  // Ruta para iniciar sesión con Facebook
  facebookLogin: (req, res, next) => {
    const redirectUrl = req.query.redirect || `${redirectURL}`;
    passport.authenticate('facebook', {
      scope: ['email'],
      state: redirectUrl
    })(req, res, next);
  },

  // Ruta de callback de Facebook
  facebookCallback: (req, res) => {
    const redirectUrl = req.query.state || `${redirectURL}`;

    // Usar el usuario del objeto req.user
    const userData = req.user.user;
    const token = AuthService.generateToken(userData);

    const script = `
      <script>
        window.opener.postMessage({ token: '${token}' }, '${redirectUrl}');
        window.close();
      </script>
    `;
    res.send(script);
  },

  // Middleware para validar el token JWT
  authenticateToken: (req, res, next) => {
    const token = req.query.token || req.headers['authorization'];
    if (!token) {
      return res.redirect('/');
    }

    try {
      const decoded = AuthService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.redirect('/');
    }
  },

  // Ruta protegida del dashboard
  adminDashboard: (req, res) => {
    res.json({
      message: 'Usuario autenticado exitosamente',
      user: req.user
    });
  }
};

module.exports = AuthController;