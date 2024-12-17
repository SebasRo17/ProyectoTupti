// src/presentation/controllers/CalificacionController.test.js
const CalificacionController = require('./CalificacionController');
const { sequelize } = require('../../infrastructure/database/mysqlConnection');

// Mock de sequelize
jest.mock('../../infrastructure/database/mysqlConnection', () => ({
  sequelize: {
    query: jest.fn(),
    QueryTypes: {
      INSERT: 'INSERT',
      SELECT: 'SELECT'
    }
  }
}));

describe('CalificacionController', () => {
  let mockReq;
  let mockRes;
  let consoleErrorSpy;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    // Silenciar console.error y espiar las llamadas
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('createCalificacion', () => {
    test('debería crear una calificación válida con comentario', async () => {
      mockReq.body = {
        idProducto: 1,
        idUsuario: 1,
        puntuacion: 5,
        comentario: 'Excelente producto'
      };

      sequelize.query.mockResolvedValue([1]);

      await CalificacionController.createCalificacion(mockReq, mockRes);

      expect(sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO calificacion'),
        {
          replacements: [1, 1, 'Excelente producto', 5],
          type: sequelize.QueryTypes.INSERT
        }
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 1,
        message: "Reseña creada exitosamente"
      });
    });

    test('debería crear una calificación válida sin comentario', async () => {
      mockReq.body = {
        idProducto: 1,
        idUsuario: 1,
        puntuacion: 5
      };

      sequelize.query.mockResolvedValue([1]);

      await CalificacionController.createCalificacion(mockReq, mockRes);

      expect(sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO calificacion'),
        {
          replacements: [1, 1, null, 5],
          type: sequelize.QueryTypes.INSERT
        }
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    test('debería manejar error de BD en createCalificacion', async () => {
      mockReq.body = {
        idProducto: 1,
        idUsuario: 1,
        puntuacion: 5,
        comentario: 'Test'
      };

      const dbError = new Error('Error de BD');
      sequelize.query.mockRejectedValue(dbError);

      await CalificacionController.createCalificacion(mockReq, mockRes);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error en createCalificacion:',
        dbError
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Error al crear la reseña"
      });
    });

    test('debería validar puntuación entre 1 y 5', async () => {
      mockReq.body = {
        idProducto: 1,
        idUsuario: 1,
        puntuacion: 6,
        comentario: 'Test'
      };

      await CalificacionController.createCalificacion(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "La puntuación es requerida y debe estar entre 1 y 5"
      });
    });

    test('debería validar comentario no vacío', async () => {
      mockReq.body = {
        idProducto: 1,
        idUsuario: 1,
        puntuacion: 4,
        comentario: '   '
      };

      await CalificacionController.createCalificacion(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "El comentario no puede estar vacío"
      });
    });
  });

  describe('getCalificaciones', () => {
    test('debería obtener calificaciones de un producto', async () => {
      mockReq.params.idProducto = '1';
      const mockCalificaciones = [
        { 
          id: 1, 
          IdProducto: 1, 
          Puntuacion: 5, 
          Comentario: 'Excelente',
          NombreUsuario: 'Usuario Test' 
        }
      ];

      sequelize.query.mockResolvedValue(mockCalificaciones);

      await CalificacionController.getCalificaciones(mockReq, mockRes);

      expect(sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT c.*, u.Nombre as NombreUsuario'),
        expect.any(Object)
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockCalificaciones);
    });

    test('debería manejar errores de base de datos', async () => {
      mockReq.params.idProducto = '1';
      sequelize.query.mockRejectedValue(new Error('Error de BD'));

      await CalificacionController.getCalificaciones(mockReq, mockRes);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error en getCalificaciones:',
        expect.any(Error)
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Error al obtener las reseñas"
      });
    });
  });
});