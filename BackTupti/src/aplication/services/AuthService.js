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
          Nombre: profile.displayName,
          IdRol: 2 // Rol por defecto para usuarios de Facebook
        });
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

static generateToken(user) {
  const payload = {
    IdUsuario: user.IdUsuario,
    Nombre: user.Nombre,
    Email: user.Email,
    CodigoUs: user.CodigoUs,
    IdRol: user.IdRol,
    isAdmin: user.IdRol === 1,
    roleName: user.IdRol === 1 ? 'Administrador' : 'Cliente'
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;