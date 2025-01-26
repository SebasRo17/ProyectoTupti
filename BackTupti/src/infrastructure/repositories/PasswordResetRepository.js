const PasswordReset = require('../../domain/models/PasswordReset');
const { Op } = require('sequelize');

class PasswordResetRepository {
  async create(data) {
    return await PasswordReset.create(data);
  }

  async findValidToken(token) {
    return await PasswordReset.findOne({
      where: {
        token,
        used: false,
        expiresAt: {
          [Op.gt]: new Date()
        }
      }
    });
  }

  async markAsUsed(token) {
    return await PasswordReset.update(
      { used: true },
      { where: { token } }
    );
  }
}

module.exports = PasswordResetRepository;