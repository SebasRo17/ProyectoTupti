const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Ruta para iniciar sesión con Google
router.get('/google', (req, res, next) => {
  const redirectUrl = req.query.redirect || 'http://localhost:5173/';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: redirectUrl
  })(req, res, next);
});

// Ruta de callback de Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const redirectUrl = req.query.state || 'http://localhost:5173/';
  const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  // Redirigir al cliente a la URL principal
  const script = `
    <script>
    window.opener.postMessage({ token: '${token}' }, '${redirectUrl}');
      window.opener.location.href = '${redirectUrl}?token=${req.user.token}';
      window.close();
    </script>
  `;
  res.send(script);
});
// Ruta para iniciar sesión con Facebook
router.get('/facebook', (req, res, next) => {
  const redirectUrl = req.query.redirect || 'http://localhost:5173/';
  passport.authenticate('facebook', {
    scope: ['email'],
    state: redirectUrl
  })(req, res, next);
});

// Ruta de callback de Facebook
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
  const redirectUrl = req.query.state || 'http://localhost:5173/';
  const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  // Redirigir al cliente con el token JWT
  const script = `
    <script>
    window.opener.postMessage({ token: '${token}' }, '${redirectUrl}');
      window.opener.location.href = '${redirectUrl}?token=${req.user.token}';
      window.close();
    </script>
  `;
  res.send(script);
});

// Middleware para validar el token JWT
function authenticateToken(req, res, next) {
  const token = req.query.token || req.headers['authorization'];
  if (!token) {
    return res.redirect('/');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect('/');
    }
    req.user = decoded;
    next();
  });
}

// Ruta protegida del dashboard
router.get('/Admin', authenticateToken, (req, res) => {
  res.json({
    message: 'Usuario autenticado exitosamente',
    user: req.user
  });
});

module.exports = router;