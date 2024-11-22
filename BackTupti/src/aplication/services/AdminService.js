const AdminRepository = require('../../infrastructure/repositories/AdminRepositoryImpl');
const bcrypt = require('bcrypt');

class AdminService {
  async login(email, password) {
    try {
      const admin = await AdminRepository.findByEmail(email);
      if (!admin) {
        throw new Error('Credenciales inválidas');
      }

      const isPasswordValid = await bcrypt.compare(password, admin.Contrasenia);
      if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
      }

      if (admin.rol !== 'admin') {
        throw new Error('No tienes permisos de administrador');
      }

      return admin;
    } catch (error) {
      console.error('Error en el servicio de login de admin:', error);
      throw error;
    }
  }
}

module.exports = new AdminService();

