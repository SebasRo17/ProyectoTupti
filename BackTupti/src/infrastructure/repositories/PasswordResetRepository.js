const PasswordReset = require('../../domain/models/PasswordReset');
const { Op } = require('sequelize');

class PasswordResetRepository {
  async create(data) {
    try {
      return await PasswordReset.create({
        IdUsuario: data.IdUsuario,
        token: data.token,
        expiresAt: data.expiresAt
      });
    } catch (error) {
      console.error('Error creating password reset:', error);
      throw new Error('Error al crear la solicitud de reset de contraseña');
    }
  }

  async findValidToken(token) {
    if (!token) {
      throw new Error('Token no proporcionado');
    }

    try {
      const resetRequest = await PasswordReset.findOne({
        where: {
          token: token,
          used: false,
          expiresAt: {
            [Op.gt]: new Date()
          }
        }
      });

      if (!resetRequest) {
        throw new Error('Token inválido o expirado');
      }

      return resetRequest;
    } catch (error) {
      console.error('Error finding token:', error);
      throw error;
    }
  }

  async markAsUsed(token) {
    if (!token) {
      throw new Error('Token no proporcionado');
    }

    try {
      const result = await PasswordReset.update(
        { used: true },
        { 
          where: { token: token },
          returning: true
        }
      );

      if (result[0] === 0) {
        throw new Error('Token no encontrado');
      }

      return true;
    } catch (error) {
      console.error('Error marking token as used:', error);
      throw error;
    }
  }
}

module.exports = PasswordResetRepository;