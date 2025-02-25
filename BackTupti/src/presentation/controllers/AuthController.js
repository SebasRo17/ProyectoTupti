require('dotenv').config();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('./../../domain/models/User');
const AuthService = require('../../aplication/services/AuthService');
const redirectURL = process.env.NODE_ENV === 'production' ? process.env.PROD_URL1 : process.env.DEV_URL1;

class AuthController {
  static async login(req, res) {
    try {
      // ...existing code...

      // Verificar la estructura del token que se está generando
      const tokenPayload = {
        IdUsuario: user.IdUsuario,
        Nombre: user.Nombre,
        Email: user.Email,
        CodigoUs: user.CodigoUs,
        IdRol: user.IdRol,
        roleName: user.role?.NombreRol || 'Cliente',
        isAdmin: user.role?.NombreRol === 'Administrador'
      };

      console.log('Token payload a generar:', tokenPayload);

      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      console.log('Token generado correctamente');

      res.json({
        token,
        user: tokenPayload
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Ruta para iniciar sesión con Google
  static googleLogin(req, res, next) {
    const redirectUrl = req.query.redirect || `${redirectURL}`;
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: redirectUrl
    })(req, res, next);
  }

  // En AuthController.js
  static googleCallback(req, res) {
    try {
      const redirectUrl = process.env.NODE_ENV === 'production'
        ? 'https://www.tupti.store'
        : 'http://localhost:5173';

      if (!req.user) {
        console.error('No user data in request');
        return res.status(401).send('Authentication failed');
      }

      // Aquí está el cambio importante - asegúrate de usar req.user.user
      const userData = req.user.user;

      // Crear el objeto con todos los datos necesarios
      const tokenPayload = {
        IdUsuario: userData.IdUsuario,
        Nombre: userData.Nombre,
        Email: userData.Email,
        CodigoUs: userData.CodigoUs,
        IdRol: userData.IdRol,
        isAdmin: userData.IdRol === 1,
        roleName: userData.IdRol === 1 ? 'Administrador' : 'Cliente'
      };

      const token = AuthService.generateToken(tokenPayload);
      console.log('Token generado:', token);
      console.log('Datos del usuario:', tokenPayload);

      const script = `
        <script>
          try {
            if (window.opener) {
              window.opener.postMessage(
                { 
                  type: 'AUTH_SUCCESS',
                  token: '${token}',
                  user: ${JSON.stringify(tokenPayload)}
                }, 
                '${redirectUrl}'
              );
              console.log('Mensaje enviado al opener');
              window.close();
            } else {
              console.error('No window.opener found');
              window.location.href = '${redirectUrl}?token=${token}';
            }
          } catch (e) {
            console.error('Error en postMessage:', e);
            window.location.href = '${redirectUrl}?token=${token}';
          }
        </script>
      `;
      res.send(script);
    } catch (error) {
      console.error('Error en callback:', error);
      res.status(500).send('Error interno del servidor');
    }
  }

  // Ruta para iniciar sesión con Facebook
  static facebookLogin(req, res, next) {
    const redirectUrl = req.query.redirect || `${redirectURL}`;
    passport.authenticate('facebook', {
      scope: ['email'],
      state: redirectUrl
    })(req, res, next);
  }

  static facebookCallback(req, res) {
    try {
      const redirectUrl = process.env.NODE_ENV === 'production'
        ? 'https://www.tupti.store'
        : 'http://localhost:5173';

      if (!req.user) {
        console.error('No user data in request');
        return res.status(401).send('Authentication failed');
      }

      // Usar los datos del usuario
      const userData = req.user.user;

      // Crear el token con todos los datos necesarios
      const tokenPayload = {
        IdUsuario: userData.IdUsuario,
        Nombre: userData.Nombre,
        Email: userData.Email,
        CodigoUs: userData.CodigoUs,
        IdRol: userData.IdRol,
        isAdmin: userData.IdRol === 1,
        roleName: userData.IdRol === 1 ? 'Administrador' : 'Cliente'
      };

      const token = AuthService.generateToken(tokenPayload);
      console.log('Token generado:', token);
      console.log('Datos del usuario:', tokenPayload);

      const script = `
        <script>
          try {
            if (window.opener) {
              window.opener.postMessage(
                { 
                  type: 'AUTH_SUCCESS',
                  token: '${token}',
                  user: ${JSON.stringify(tokenPayload)}
                }, 
                '${redirectUrl}'
              );
              console.log('Mensaje enviado al opener');
              window.close();
            } else {
              console.error('No window.opener found');
              window.location.href = '${redirectUrl}?token=${token}';
            }
          } catch (e) {
            console.error('Error en postMessage:', e);
            window.location.href = '${redirectUrl}?token=${token}';
          }
        </script>
      `;
      res.send(script);
    } catch (error) {
      console.error('Error en callback de Facebook:', error);
      res.status(500).send('Error interno del servidor');
    }
  }

  // Middleware para validar el token JWT
  static authenticateToken(req, res, next) {
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
  }

  // Ruta protegida del dashboard
  static adminDashboard(req, res) {
    res.json({
      message: 'Usuario autenticado exitosamente',
      user: req.user
    });
  }
}

module.exports = AuthController;