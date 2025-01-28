require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const UserService = require('../aplication/services/UserService');
const AuthService = require('../aplication/services/AuthService');

module.exports = function configurePassport() {
  // Configuración de URLs
    
  const googleCallbackURL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/auth/google/callback'  // URL del backend
  : `https://proyectotupti.onrender.com  `;

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: googleCallbackURL,
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      const userRepository = require('../infrastructure/repositories/UserRepositoryImpl');
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

  // Configurar estrategia de Facebook
  const facebookCallbackURL = `http://localhost:3000/auth/facebook/callback`;
  console.log('Facebook Callback URL:', facebookCallbackURL);

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: facebookCallbackURL,
    profileFields: ['id', 'emails', 'name']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const userRepository = require('../infrastructure/repositories/UserRepositoryImpl');
      let user = await userRepository.findByEmail(profile.emails[0].value);

      if (!user) {
        console.log('Creando nuevo usuario de Facebook');
        user = await UserService.createUser({
          Email: profile.emails[0].value,
          Contrasenia: 'facebook-auth', 
          CodigoUs: `FACEBOOK-${Date.now()}`,
          FacebookId: profile.id,
          Nombre: `${profile.name.givenName} ${profile.name.familyName}`,
          IdRol: 2
        });
      }

      const token = AuthService.generateToken(user);
      console.log('Token generado para usuario de Facebook');

      return done(null, { user, token });
    } catch (error) {
      console.error('Error en autenticación de Facebook:', error);
      return done(error, null);
    }
  }));

  passport.serializeUser((data, done) => {
    done(null, data.user.IdUsuario);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const userRepository = require('../infrastructure/repositories/UserRepositoryImpl');
      const user = await userRepository.findByPk(id);
      done(null, user);
    } catch (error) {
      console.error('Error en deserialización:', error);
      done(error, null);
    }
  });
};