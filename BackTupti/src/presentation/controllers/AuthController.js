const express = require('express');
const passport = require('passport');

class AuthController {
  async googleAuth(req, res, next) {
    passport.authenticate('google', { 
      scope: ['profile', 'email'] 
    })(req, res, next);
  }

  async googleCallback(req, res, next) {
    passport.authenticate('google', {
      successRedirect: '/dashboard',
      failureRedirect: '/login'
    })(req, res, next);
  }

  async getDashboard(req, res) {
    if (!req.user) {
      return res.redirect('/login');
    }
    res.json({ message: 'Logged in successfully', user: req.user });
  }

   // Método para encontrar o crear usuario de Facebook
   async findOrCreateFacebookUser(profile) {
    try {
      // Buscar usuario por ID de Facebook
      let user = await User.findOne({
        where: { FacebookId: profile.id }
      });

      // Si no existe, crear nuevo usuario
      if (!user) {
        user = await User.create({
          Email: profile.emails[0].value,
          Nombre: profile.displayName,
          FacebookId: profile.id,
          Activo: true
        });
      }

      return user;
    } catch (error) {
      console.error('Error en findOrCreateFacebookUser:', error);
      throw error;
    }
  }

  // Generar token JWT
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.IdUsuario, 
        email: user.Email,
        nombre: user.Nombre
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
  }

  // Verificar token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new AuthController();