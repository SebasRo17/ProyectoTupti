const jwt = require('jsonwebtoken');
const User = require('../../domain/models/User');

class AuthService {
  static async findOrCreateFacebookUser(profile) {
    try {
      // Buscar usuario por ID de Facebook
      let user = await User.findOne({
        where: { FacebookId: profile.id }
      });

      // Si no existe, crear nuevo usuario
      if (!user) {
        user = await User.create({
          Email: profile.emails[0].value,
          Contrasenia: 'facebook-auth',
          CodigoUs: `FACEBOOK-${Date.now()}`,
          FacebookId: profile.id,
          Nombre: profile.displayName
        });
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  static generateToken(user) {
    return jwt.sign({ id: user.IdUsuario, email: user.Email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }
}

module.exports = AuthService;