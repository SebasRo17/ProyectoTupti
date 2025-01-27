const User = require('../../domain/models/User');
const bcrypt = require('bcrypt');

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
      
      // Validar que no se pueda cambiar el rol a uno inválido
      if (userData.IdRol && ![1, 2].includes(Number(userData.IdRol))) {
        throw new Error('Rol inválido. Solo se permiten roles 1 (Admin) o 2 (Cliente)');
      }

      console.log('Datos para actualizar en el repositorio:', userData);

      return await user.update(userData);
    } catch (error) {
      console.error('Error al actualizar usuario en el repositorio:', error);
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      console.log('Buscando usuario con email:', email);
      
      const user = await User.findOne({
        where: {
          Email: email,
          Activo: 1 // Solo usuarios activos
        }
      });
      
      console.log('Resultado de búsqueda:', user ? 'Usuario encontrado' : 'No encontrado');
      
      if (user) {
        // Añadir validación de rol
        const isAdmin = user.IdRol === 1;
        const isClient = user.IdRol === 2;
        
        return {
          ...user.toJSON(),
          isAdmin,
          isClient
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error al buscar usuario por email:', error);
      throw error;
    }
  }

  async emailExists(email) {
    try {
      const count = await User.count({
        where: {
          Email: email
        }
      });
      return count > 0;
    } catch (error) {
      console.error('Error al verificar email existente:', error);
      throw error;
    }
  }

  async updatePassword(userId, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.update(
        { Contrasenia: hashedPassword },
        { where: { IdUsuario: userId } }
      );
      return true;
    } catch (error) {
      console.error('Error actualizando contraseña:', error);
      throw error;
    }
  }
}

module.exports = new UserRepositoryImpl();