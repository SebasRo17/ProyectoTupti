const jwt = require('jsonwebtoken');
const AuthService = require('./AuthService');
const User = require('../../domain/models/User');

// Mock de variables de entorno
process.env.JWT_SECRET = 'test-secret';

// Mock User model
jest.mock('../../domain/models/User');

describe('AuthService', () => {
  describe('generateToken', () => {
    test('debería generar un token válido para usuario normal', () => {
      const mockUser = {
        IdUsuario: 1,
        Nombre: 'Test User',
        Email: 'test@example.com',
        CodigoUs: 'TEST001',
        IdRol: 2
      };

      const token = AuthService.generateToken(mockUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded).toMatchObject({
        IdUsuario: mockUser.IdUsuario,
        Nombre: mockUser.Nombre,
        Email: mockUser.Email,
        CodigoUs: mockUser.CodigoUs,
        IdRol: mockUser.IdRol,
        isAdmin: false,
        roleName: 'Cliente'
      });
    });

    test('debería generar un token válido para administrador', () => {
      const mockAdminUser = {
        IdUsuario: 1,
        Nombre: 'Admin User',
        Email: 'admin@example.com',
        CodigoUs: 'ADMIN001',
        IdRol: 1
      };

      const token = AuthService.generateToken(mockAdminUser);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.isAdmin).toBe(true);
      expect(decoded.roleName).toBe('Administrador');
    });

    test('debería generar tokens diferentes para usuarios diferentes', () => {
      const user1 = { IdUsuario: 1, Email: 'user1@example.com', IdRol: 2 };
      const user2 = { IdUsuario: 2, Email: 'user2@example.com', IdRol: 2 };
      
      const token1 = AuthService.generateToken(user1);
      const token2 = AuthService.generateToken(user2);
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    test('debería verificar un token válido correctamente', () => {
      const mockUser = {
        IdUsuario: 1,
        Nombre: 'Test User',
        Email: 'test@example.com',
        CodigoUs: 'TEST001',
        IdRol: 2
      };

      const token = AuthService.generateToken(mockUser);
      const verified = AuthService.verifyToken(token);
      
      expect(verified).toBeDefined();
      expect(verified.Email).toBe(mockUser.Email);
      expect(verified.IdUsuario).toBe(mockUser.IdUsuario);
      expect(verified.roleName).toBe('Cliente');
    });

    test('debería lanzar error al verificar un token inválido', () => {
      expect(() => {
        AuthService.verifyToken('token-invalido');
      }).toThrow();
    });

    test('debería lanzar error con token expirado', () => {
      const mockUser = {
        IdUsuario: 1,
        Email: 'test@example.com',
        IdRol: 2
      };

      const token = jwt.sign(
        { 
          id: mockUser.IdUsuario, 
          email: mockUser.Email,
          isAdmin: false,
          idRol: mockUser.IdRol
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '0s' }
      );

      expect(() => {
        AuthService.verifyToken(token);
      }).toThrow();
    });
  });

  describe('findOrCreateFacebookUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('debería encontrar usuario existente de Facebook', async () => {
      const mockUser = {
        id: 1,
        Email: 'test@facebook.com',
        FacebookId: 'fb123'
      };

      User.findOne.mockResolvedValue(mockUser);

      const profile = {
        id: 'fb123',
        emails: [{ value: 'test@facebook.com' }],
        displayName: 'Test User'
      };

      const result = await AuthService.findOrCreateFacebookUser(profile);
      expect(result).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({
        where: { FacebookId: 'fb123' }
      });
    });

    test('debería crear nuevo usuario de Facebook', async () => {
      User.findOne.mockResolvedValue(null);
      
      const mockNewUser = {
        id: 2,
        Email: 'new@facebook.com',
        FacebookId: 'fb456',
        Nombre: 'New User',
        IdRol: 2
      };

      User.create.mockResolvedValue(mockNewUser);

      const profile = {
        id: 'fb456',
        emails: [{ value: 'new@facebook.com' }],
        displayName: 'New User'
      };

      const result = await AuthService.findOrCreateFacebookUser(profile);
      expect(result).toEqual(mockNewUser);
      expect(User.create).toHaveBeenCalledWith({
        Email: 'new@facebook.com',
        Contrasenia: 'facebook-auth',
        CodigoUs: expect.stringContaining('FACEBOOK-'),
        FacebookId: 'fb456',
        Nombre: 'New User',
        IdRol: 2
      });
    });

    test('debería manejar errores en la búsqueda/creación', async () => {
      User.findOne.mockRejectedValue(new Error('DB Error'));

      const profile = {
        id: 'fb789',
        emails: [{ value: 'error@facebook.com' }],
        displayName: 'Error User'
      };

      await expect(AuthService.findOrCreateFacebookUser(profile))
        .rejects
        .toThrow('DB Error');
    });
  });
});