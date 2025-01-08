const UserRepository = require('../../infrastructure/repositories/UserRepositoryImpl');
const User = require('../../domain/models/User')
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const AuthService = require('../../aplication/services/AuthService');

class UserService {
  async getAllUsers() {
    try {
      return await UserRepository.findAll();
    } catch (error) {
      console.error('Error en el servicio de usuarios:', error);
      throw error;
    }
  }

  async createUser({ Email, Contrasenia, Nombre }) {
    try {
      console.log('Datos recibidos en createUser:', { Email, Contrasenia, Nombre });
  
      const hashedPassword = await bcrypt.hash(Contrasenia, 10);
      const user = await User.create({
        Email,
        Contrasenia: hashedPassword,
        Nombre,
        IdRol: 2,
        Activo: true
      });
  
      const CodigoUs = `US${String(user.IdUsuario).padStart(3, '0')}`;
      user.CodigoUs = CodigoUs;
      await user.save();
  
      return user;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }
  
  async updateUser(userId, userData) {
    try {
      if (userData.Contrasenia) {
        userData.Contrasenia = await bcrypt.hash(userData.Contrasenia, 10);
      }
      console.log('Datos para actualizar en el servicio:', userData);
      return await UserRepository.update(userId, userData);
    } catch (error) {
      console.error('Error al actualizar usuario en el servicio:', error);
      throw error;
    }
  }
  async login(email, password) {
    try {
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Debug de contraseñas
      const md5Hash = crypto.createHash('md5').update(password).digest('hex');

      console.log('========= Debug de contraseñas =========');
      console.log('1. Password ingresado:', password);
      console.log('2. Password en MD5:', md5Hash);
      console.log('3. Password en BD:', user.Contrasenia);
      console.log('4. Longitud password BD:', user.Contrasenia.length);

      // Intentar comparación con ambos métodos
      const isValidBcrypt = await bcrypt.compare(password, user.Contrasenia);
      const isValidMD5 = md5Hash === user.Contrasenia;

      console.log('5. ¿Válido con bcrypt?:', isValidBcrypt);
      console.log('6. ¿Válido con MD5?:', isValidMD5);
      console.log('=====================================');

      // Si ninguna validación funciona
      if (!isValidBcrypt && !isValidMD5) {
        throw new Error('Credenciales inválidas');
      }
      if (![1, 2].includes(user.IdRol)) {
        throw new Error('Rol de usuario no válido');
      }
      const userData = {
        IdUsuario: user.IdUsuario,
        Nombre: user.Nombre,
        Email: user.Email,
        CodigoUs: user.CodigoUs,
        IdRol: user.IdRol,
        isAdmin: user.IdRol === 1,
        roleName: user.IdRol === 1 ? 'Administrador' : 'Cliente'
      };
      const token = AuthService.generateToken(userData);
      return {
        user: userData,
        token
      };

    } catch (error) {
      console.error('Error en el servicio de login:', error);
      throw error;
    }
  }
}
module.exports = new UserService();