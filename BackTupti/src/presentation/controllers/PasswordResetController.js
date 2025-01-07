const PasswordResetService = require('../../aplication/services/PasswordResetService');

class PasswordResetController {
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      await PasswordResetService.initiatePasswordReset(email);
      res.status(200).json({ 
        message: "Si el correo existe, recibirás instrucciones para restablecer tu contraseña." 
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      await PasswordResetService.resetPassword(token, newPassword);
      res.status(200).json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new PasswordResetController();