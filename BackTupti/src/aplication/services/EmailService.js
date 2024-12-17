const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Credenciales de email no configuradas');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',  // Especificamos 'gmail' en lugar de host/port
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendTemporaryPassword(email, temporaryPassword) {
    try {
      // Verificar conexión
      await this.transporter.verify();
      
      const info = await this.transporter.sendMail({
        from: `"Tu Aplicación" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Recuperación de Contraseña",
        html: `
          <h1>Recuperación de Contraseña</h1>
          <p>Tu nueva contraseña temporal es: <strong>${temporaryPassword}</strong></p>
          <p>Por seguridad, te recomendamos cambiar esta contraseña una vez inicies sesión.</p>
          <p>Si no solicitaste este cambio, por favor contacta con soporte.</p>
        `
      });
      
      console.log('Email enviado:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error enviando email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();