const UserRepository = require('../../infrastructure/repositories/UserRepositoryImpl');
const User = require('../../domain/models/User')
const bcrypt = require('bcrypt');

class UserService {
  async getAllUsers() {
    try {
      return await UserRepository.findAll();
    } catch (error) {
      console.error('Error en el servicio de usuarios:', error);
      throw error;
    }
  }

  async createUser({ Email, Contrasenia }) {
    try {
      const hashedPassword = await bcrypt.hash(Contrasenia, 10);
      const user = await User.create({ Email, Contrasenia: hashedPassword });
      const CodigoUs = `US${String(user.IdUsuario).padStart(3, '0')}`;
      user.CodigoUs = CodigoUs;
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }
  async updateUser(userId, userData) {
    try {
      if (userData.Contrasenia) {
        userData.Contrasenia = await bcrypt.hash(userData.Contrasenia, 10);
      }
      return await UserRepository.update(userId, userData);
    } catch (error) {
      console.error('Error al actualizar usuario en el servicio:', error);
      throw error;
    }
  }
  async login(email, password) {
    try {
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Agregar registros para depuración
      console.log('Contraseña proporcionada:', password);
      console.log('Contraseña almacenada:', user.Contrasenia);

      const isPasswordValid = await bcrypt.compare(password, user.Contrasenia);
      if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
      }

      return user;
    } catch (error) {
      console.error('Error en el servicio de login:', error);
      throw error;
    }
  }
}

module.exports = new UserService();