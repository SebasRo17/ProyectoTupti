const User = require('../../domain/models/User');

class UserRepositoryImpl {
  async findAll() {
    try {
      return await User.findAll();
    } catch (error) {
      console.error('Error al obtener usuarios desde el repositorio:', error);
      throw error;
    }
  }

  async create(userData) {
    try {
      return await User.create(userData);
    } catch (error) {
      console.error('Error al crear usuario en el repositorio:', error);
      throw error;
    }
  }

  async update(userId, userData) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error(`Usuario con ID ${userId} no encontrado`);
      }
      return await user.update(userData);
    } catch (error) {
      console.error('Error al actualizar usuario en el repositorio:', error);
      throw error;
    }
  }
  async findByEmail(email) {
    try {
      return await User.findOne({
        where: {
          Email: email
        }
      });
    } catch (error) {
      console.error('Error al buscar usuario por email:', error);
      throw error;
    }
  }
}

module.exports = new UserRepositoryImpl();