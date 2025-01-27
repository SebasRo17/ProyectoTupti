const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Verificar que las credenciales estén disponibles
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Faltan credenciales de email en las variables de entorno');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',  // Cambiado a 'gmail' en lugar de host/port
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Cambiado a EMAIL_PASS para coincidir con el .env
      }
    });

    // Verificar la conexión al inicio
    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Servidor listo para enviar emails');
    } catch (error) {
      console.error('Error en la configuración del correo:', error);
    }
  }

  async sendEmail(to, subject, html) {
    try {
      if (!this.transporter) {
        throw new Error('Transporter no inicializado');
      }

      const mailOptions = {
        from: `"Tupti Support" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error detallado al enviar email:', error);
      throw new Error('Error al enviar el correo electrónico');
    }
  }
}

module.exports = new EmailService();
