const User = require('../../domain/models/User');
const Rol = require('../../domain/models/Rol');

class AdminRepositoryImpl {
  async findByEmail(email) {
    try {
      const user = await User.findOne({ where: { Email: email } });
      if (!user) {
        return null;
      }
      const rol = await Rol.findOne({ where: { IdRol: user.IdRol } });
      if (rol.Detalle !== 'Administrador') {
        return null;
      }
      return user;
    } catch (error) {
      console.error('Error al buscar admin por email:', error);
      throw error;
    }
  }
}

module.exports = new AdminRepositoryImpl();

