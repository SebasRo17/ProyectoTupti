const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const UserService = require('./UserService');
const User = require('../../domain/models/User');

class GoogleAuthService {
  constructor() {
    this.initializePassport();
  }

  initializePassport() {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
      try {
        const userRepository = require('../../infrastructure/repositories/UserRepositoryImpl');
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

    passport.serializeUser((data, done) => {
      done(null, data.user.IdUsuario);
    });

    passport.deserializeUser(async (id, done) => {
      try {
        const userRepository = require('../../infrastructure/repositories/UserRepositoryImpl');
        const user = await User.findByPk(id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });
  }
}

module.exports = new GoogleAuthService();