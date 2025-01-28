require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserService = require('./UserService');
const AuthService = require('./AuthService');
const User = require('../../domain/models/User');

class GoogleAuthService {
  constructor() {
    this.initializePassport();
  }

  initializePassport() {
    // Configuración de URLs
    const mainURL = process.env.NODE_ENV === 'production' 
      ? process.env.PROD_URL1  // https://tupti.store
      : process.env.DEV_URL1;  // http://localhost:5173
      
    const alternateURL = process.env.NODE_ENV === 'production'
      ? process.env.PROD_URL1   // https://proyectotupti.onrender.com
      : process.env.DEV_URL1;   // http://localhost:3000

    // Logs para debugging
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Main URL:', mainURL);
    console.log('Alternate URL:', alternateURL);

    const googleCallbackURL = `${mainURL}/auth/google/callback`;
    console.log('Google Callback URL:', googleCallbackURL);

    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: googleCallbackURL,
      passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
      try {
        const userRepository = require('../../infrastructure/repositories/UserRepositoryImpl');
        let user = await userRepository.findByEmail(profile.emails[0].value);

        if (!user) {
          const nombre = profile.displayName || profile.name?.givenName || profile.name?.familyName || 'Usuario Google';
          console.log('Creando nuevo usuario de Google:', nombre);
          user = await UserService.createUser({
            Email: profile.emails[0].value,
            Contrasenia: 'google-auth', 
            CodigoUs: `GOOGLE-${Date.now()}`,
            IdRol: 2,
            Nombre: nombre
          });
        }

        const token = AuthService.generateToken(user);
        console.log('Token generado para usuario de Google');

        return done(null, { user, token });
      } catch (error) {
        console.error('Error en autenticación de Google:', error);
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
    console.log('Verificando configuración de Google Auth:');
    console.log('Client ID configurado:', !!process.env.GOOGLE_CLIENT_ID);
    console.log('Client Secret configurado:', !!process.env.GOOGLE_CLIENT_SECRET);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('PROD_URL1:', process.env.PROD_URL1);
    console.log('DEV_URL1:', process.env.DEV_URL1);
  }
}

// Crear una única instancia del servicio
const googleAuthService = new GoogleAuthService();
googleAuthService.verifyConfiguration();

module.exports = googleAuthService;