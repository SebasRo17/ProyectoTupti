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
    const googleCallbackURL = process.env.NODE_ENV === 'production'
      ? 'https://proyectotupti.onrender.com/auth/google/callback'
      : 'http://localhost:3000/auth/google/callback';
    
    // En la estrategia de Google (GoogleAuthService.js)
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

    // Asegúrate de que todos los campos necesarios estén presentes
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
    console.error('Error en autenticación de Google:', error);
    return done(error, null);
  }
}));
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