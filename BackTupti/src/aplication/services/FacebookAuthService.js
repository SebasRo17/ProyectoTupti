const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const AuthService = require('../services/AuthService');
const User = require('../../domain/models/User'); // Asegúrate de importar el modelo User

function configurePassport() {
  // Estrategia de Facebook
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Encontrar o crear usuario
      const user = await AuthService.findOrCreateFacebookUser(profile);
      
      // Generar token
      const token = AuthService.generateToken(user);
      
      // Pasar usuario y token
      return done(null, { user, token });
    } catch (error) {
      return done(error);
    }
  }));

  // Serializar usuario para la sesión
  passport.serializeUser((userData, done) => {
    done(null, userData.user.IdUsuario);
  });

  // Deserializar usuario
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

module.exports = configurePassport;