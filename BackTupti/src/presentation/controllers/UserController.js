const UserService = require('../../aplication/services/UserService');

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
      const { Email, Contrasenia, Activo } = req.body;

      // Validación básica
      if (!Email || !Contrasenia || Activo === undefined) {
        return res.status(400).json({ 
          message: 'Todos los campos son requeridos' 
        });
      }

      const updatedUser = await UserService.updateUser(userId, {
        Email,
        Contrasenia,
        Activo
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
      const { email, password } = req.body;
      const user = await UserService.login(email, password);
      res.status(200).json(user);
    } catch (error) {
      console.error('Error en el login:', error);
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  }
}

module.exports = new UserController();