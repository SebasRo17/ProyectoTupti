const nodemailer = require('nodemailer');
const crypto = require('crypto');
const EmailVerification = require('../../domain/models/EmailVerification');
const User = require('../../domain/models/User');

class EmailVerificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendVerificationEmail(userId, email) {
    try {
      // Generar token único
      const token = crypto.randomBytes(32).toString('hex');
      
      // Establecer expiración (24 horas)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Guardar token en BD
      await EmailVerification.create({
        IdUsuario: userId,
        token,
        expiresAt
      });

      // URL de verificación
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

      // Enviar email
      await this.transporter.sendMail({
        from: `"Tupti" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verifica tu correo electrónico - Tupti',
        html: `
          <h1>Bienvenido a Tupti</h1>
          <p>Por favor, verifica tu correo electrónico haciendo clic en el siguiente enlace:</p>
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
            Verificar correo electrónico
          </a>
          <p>Este enlace expirará en 24 horas.</p>
        `
      });

      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Error al enviar email de verificación');
    }
  }

  async verifyEmail(token) {
    try {
      const verification = await EmailVerification.findOne({
        where: { token }
      });

      if (!verification || verification.expiresAt < new Date()) {
        throw new Error('Token inválido o expirado');
      }

      // Actualizar estado de verificación del usuario
      await User.update(
        { EmailVerificado: true },
        { where: { IdUsuario: verification.IdUsuario } }
      );

      // Eliminar token usado
      await verification.destroy();

      return true;
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  }
}

module.exports = new EmailVerificationService();