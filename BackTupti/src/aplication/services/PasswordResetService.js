const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Usuario = require('../../domain/models/User');
const PasswordResetRepository = require('../../infrastructure/repositories/PasswordResetRepository');
const EmailService = require('./EmailService');

class PasswordResetService {
  constructor() {
    this.passwordResetRepository = new PasswordResetRepository();
  }

  async initiatePasswordReset(email) {
    // Verificar si el email existe
    const user = await Usuario.findOne({ where: { Email: email } });
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return true;
    }

    // Generar token único
    const token = crypto.randomBytes(32).toString('hex');
    
    // Establecer expiración (24 horas)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Guardar token en BD
    await this.passwordResetRepository.create({
      IdUsuario: user.IdUsuario,
      token,
      expiresAt
    });

    // Enviar email
    const resetUrl = `${process.env.FRONTEND_URL}/recuperar-contrasena/${token}`;
    await this.sendResetEmail(email, resetUrl);

    return true;
  }

  async resetPassword(token, newPassword) {
    // Verificar token
    const resetRequest = await this.passwordResetRepository.findValidToken(token);
    if (!resetRequest) {
      throw new Error('Token inválido o expirado');
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña del usuario
    await Usuario.update(
      { Contrasenia: hashedPassword },
      { where: { IdUsuario: resetRequest.IdUsuario } }
    );

    // Marcar token como usado
    await this.passwordResetRepository.markAsUsed(token);

    return true;
  }

  async sendResetEmail(email, resetUrl) {
    const htmlContent = `
      <h1>Recuperación de contraseña</h1>
      <p>Has solicitado restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente enlace para establecer una nueva contraseña:</p>
      <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
        Restablecer contraseña
      </a>
      <p>Este enlace expirará en 24 horas.</p>
      <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
      <hr>
      <p style="color: #666; font-size: 12px;">Este es un email automático, por favor no respondas a este mensaje.</p>
    `;

    try {
      await EmailService.sendEmail(
        email,
        'Recuperación de contraseña - Tupti',
        htmlContent
      );
    } catch (error) {
      console.error('Error sending reset email:', error);
      throw new Error('Error al enviar el correo electrónico');
    }
  }
}

module.exports = new PasswordResetService();