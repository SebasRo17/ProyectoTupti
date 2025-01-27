const PasswordResetService = require('../../aplication/services/PasswordResetService');

class PasswordResetController {
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "El correo electrónico es requerido" });
      }
      await PasswordResetService.initiatePasswordReset(email);
      res.status(200).json({ 
        message: "Si el correo existe, recibirás instrucciones para restablecer tu contraseña." 
      });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ 
        message: "Ocurrió un error al procesar tu solicitud" 
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ 
          message: "Token y nueva contraseña son requeridos" 
        });
      }

      await PasswordResetService.resetPassword(token, newPassword);
      res.status(200).json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(400).json({ 
        message: error.message || "Error al restablecer la contraseña" 
      });
    }
  }
}

module.exports = new PasswordResetController();