const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');
const UserService = require('../aplication/services/UserService');

module.exports = function configurePassport() {
  // Configurar estrategia de Google
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      const userRepository = require('../infrastructure/repositories/UserRepositoryImpl');
      let user = await userRepository.findByEmail(profile.emails[0].value);

      if (!user) {
        user = await UserService.createUser({
          Email: profile.emails[0].value,
          Contrasenia: 'google-auth', 
          CodigoUs: `GOOGLE-${Date.now()}` 
        });
      }

      // Generar un token JWT
      const token = jwt.sign({ id: user.IdUsuario, email: user.Email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Token generado:', token);

      return done(null, { user, token });
    } catch (error) {
      return done(error, null);
    }
  }));

  // Configurar estrategia de Facebook
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const userRepository = require('../infrastructure/repositories/UserRepositoryImpl');
      let user = await userRepository.findByEmail(profile.emails[0].value);

      if (!user) {
        user = await UserService.createUser({
          Email: profile.emails[0].value,
          Contrasenia: 'facebook-auth', 
          CodigoUs: `FACEBOOK-${Date.now()}`,
          FacebookId: profile.id,
          Nombre: `${profile.name.givenName} ${profile.name.familyName}`
        });
      }

      // Generar un token JWT
      const token = jwt.sign({ id: user.IdUsuario, email: user.Email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Token generado:', token);

      return done(null, { user, token });
    } catch (error) {
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
      done(error, null);
    }
  });
};