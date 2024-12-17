const UserService = require('../../aplication/services/UserService');
const jwt = require('jsonwebtoken');

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

    // Validación de campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Autenticación de usuario
    const user = await UserService.login(email, password);

    // Estructuración de datos del usuario para el token
    const userPayload = {
      IdUsuario: user.IdUsuario,
      Email: user.Email,
      CodigoUs: user.CodigoUs,
      rol: user.IdRol === 1 ? 'Administrador' : 'Cliente',
      isAdmin: user.IdRol === 1,
      isClient: user.IdRol === 2
    };

    // Generación del token JWT
    const token = jwt.sign(
      { user: userPayload }, // Datos a incluir en el token
      process.env.JWT_SECRET, // Clave secreta
      { expiresIn: '1h' } // Tiempo de expiración
    );

    // Respuesta con token y datos del usuario
    return res.status(200).json({
      success: true,
      user: userPayload,
      token
    });

  } catch (error) {
    console.error('Error en el login:', error);

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
async requestPasswordReset(req, res) {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        message: 'El email es requerido' 
      });
    }

    await UserService.requestPasswordReset(email);
    
    res.json({ 
      message: 'Si el email existe en nuestra base de datos, recibirás una nueva contraseña temporal' 
    });
  } catch (error) {
    console.error('Error en controlador:', error);
    res.status(500).json({ 
      message: 'Error al procesar la solicitud' 
    });
  }
}
}

module.exports = new UserController();