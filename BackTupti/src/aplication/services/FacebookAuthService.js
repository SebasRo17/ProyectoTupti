// FacebookAuthService.js
require('dotenv').config();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const UserService = require('./UserService');
const AuthService = require('./AuthService');
const User = require('../../domain/models/User');

class FacebookAuthService {
  constructor() {
    this.initializePassport();
  }

  initializePassport() {
    // Configuración de URLs
    const facebookCallbackURL = process.env.NODE_ENV === 'production'
      ? 'https://proyectotupti.onrender.com/auth/facebook/callback'
      : 'http://localhost:3000/auth/facebook/callback';
    
    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: facebookCallbackURL,
      profileFields: ['id', 'emails', 'name', 'displayName'],
      passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
      try {
        const userRepository = require('../../infrastructure/repositories/UserRepositoryImpl');
        let user = await userRepository.findByEmail(profile.emails[0].value);

        if (!user) {
          const nombre = profile.displayName || `${profile.name.givenName} ${profile.name.familyName}` || 'Usuario Facebook';
          console.log('Creando nuevo usuario de Facebook:', nombre);
          user = await UserService.createUser({
            Email: profile.emails[0].value,
            Contrasenia: 'facebook-auth', 
            CodigoUs: `FACEBOOK-${Date.now()}`,
            FacebookId: profile.id,
            IdRol: 2,
            Nombre: nombre
          });
        }

        // Incluir todos los datos necesarios en el token
        const tokenPayload = {
          IdUsuario: user.IdUsuario,
          Nombre: user.Nombre,
          Email: user.Email,
          CodigoUs: user.CodigoUs,
          IdRol: user.IdRol,
          isAdmin: user.IdRol === 1,
          roleName: user.IdRol === 1 ? 'Administrador' : 'Cliente'
        };

        return done(null, { user: tokenPayload, token: null });
      } catch (error) {
        console.error('Error en autenticación de Facebook:', error);
        return done(error, null);
      }
    }));

    passport.serializeUser((data, done) => {
      try {
        console.log('Serializando usuario:', data.user.IdUsuario);
        done(null, data.user.IdUsuario);
      } catch (error) {
        console.error('Error en serialización:', error);
        done(error, null);
      }
    });

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findByPk(id);
        if (!user) {
          return done(new Error('Usuario no encontrado'), null);
        }
        done(null, user);
      } catch (error) {
        console.error('Error en deserialización:', error);
        done(error, null);
      }
    });
  }

  // Método para verificar la configuración
  verifyConfiguration() {
    console.log('Verificando configuración de Facebook Auth:');
    console.log('App ID configurado:', !!process.env.FACEBOOK_APP_ID);
    console.log('App Secret configurado:', !!process.env.FACEBOOK_APP_SECRET);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('PROD_URL1:', process.env.PROD_URL1);
    console.log('DEV_URL1:', process.env.DEV_URL1);
  }
}

const facebookAuthService = new FacebookAuthService();
facebookAuthService.verifyConfiguration();

module.exports = facebookAuthService;