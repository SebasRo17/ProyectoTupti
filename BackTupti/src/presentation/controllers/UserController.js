const UserService = require('../../aplication/services/UserService');
const jwt = require('jsonwebtoken');
const EmailVerificationService = require('../../aplication/services/EmailVerificationService');

class UserController {
  async getUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error en el controlador:', error);
      res.status(500).json({ message: 'Error al obtener usuarios' });
    }
  }

  async createUser(req, res) {
    try {
      const { email, contrasenia } = req.body;
      
      // Validación básica
      if (!email || !contrasenia) {
        return res.status(400).json({ 
          message: 'Email y Contrasenia son requeridos' 
        });
      }
  
      const newUser = await UserService.createUser({ Email: email, Contrasenia: contrasenia });
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ 
          message: 'El email ya está registrado' 
        });
      }
      res.status(500).json({ 
        message: 'Error al crear usuario' 
      });
    }
  }

  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const { Email, Contrasenia, Activo, Nombre } = req.body;

      // Validación básica
      if (!Email && !Contrasenia && Activo === undefined && !Nombre) {
        return res.status(400).json({ 
          message: 'Al menos un campo es requerido' 
        });
      }

      console.log('Datos recibidos para actualizar:', { Email, Contrasenia, Activo, Nombre });

      const updatedUser = await UserService.updateUser(userId, {
        Email,
        Contrasenia,
        Activo,
        Nombre
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error al actualizar usuario' });
    }
  }

  async login(req, res) {
    try {
      // Validate JSON format
      if (!req.is('application/json')) {
        return res.status(400).json({
          success: false,
          message: 'Content-Type debe ser application/json'
        });
      }

      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }

      const result = await UserService.login(email, password);

      return res.status(200).json({
        success: true,
        user: result.user,
        token: result.token
      });

    } catch (error) {
      console.error('Error en el login:', error);

      if (error instanceof SyntaxError) {
        return res.status(400).json({
          success: false,
          message: 'JSON inválido en el body de la petición'
        });
      }

      if (error.message === 'Credenciales inválidas') {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      if (error.message === 'Rol de usuario no válido') {
        return res.status(403).json({
          success: false,
          message: 'Rol de usuario no válido'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error en el servidor'
      });
    }
  }
  async registerUser(req, res) {
    try {
      const { email, contrasenia, nombre } = req.body;
      
      if (!email || !contrasenia || !nombre) {
        return res.status(400).json({ 
          message: 'Email, contraseña y nombre son requeridos' 
        });
      }
  
      const newUser = await UserService.createUser({
        Email: email,
        Contrasenia: contrasenia,
        Nombre: nombre,
        EmailVerificado: false // Añadir este campo
      });

      // Enviar email de verificación
      await EmailVerificationService.sendVerificationEmail(
        newUser.IdUsuario,
        newUser.Email
      );
  
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente. Por favor verifica tu correo electrónico.',
        user: {
          id: newUser.IdUsuario,
          email: newUser.Email,
          nombre: newUser.Nombre,
          codigoUs: newUser.CodigoUs
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Email ya registrado' });
      }
      res.status(500).json({ message: 'Error en registro de usuario' });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      
      await EmailVerificationService.verifyEmail(token);
      
      res.status(200).json({
        success: true,
        message: 'Email verificado exitosamente'
      });
    } catch (error) {
      console.error('Error en verificación de email:', error);
      
      if (error.message === 'Token inválido o expirado') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error al verificar el email'
      });
    }
  }

  async changePassword(req, res) {
    try {
      const userId = req.params.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: 'La contraseña actual y la nueva son requeridas'
        });
      }

      const result = await UserService.changePassword(userId, currentPassword, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });
    } catch (error) {
      if (error.message === 'Contraseña actual incorrecta') {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error al actualizar la contraseña'
      });
    }
  }
}

module.exports = new UserController();