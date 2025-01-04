const DireccionRepository = require('../../infrastructure/repositories/DireccionRepositoryImpl.js');
const Usuario = require('../../domain/models/User');
class DireccionService {
  async createDireccion(direccionData) {
    try {
      // Primero verificamos si el usuario existe
      const usuario = await Usuario.findByPk(direccionData.IdUsuario);
      if (!usuario) {
        throw new Error('El usuario no existe');
      }

      // Verificamos el límite de direcciones
      const cantidadDirecciones = await DireccionRepository.countByUserId(direccionData.IdUsuario);
      if (cantidadDirecciones >= 5) {
        throw new Error('El usuario ya tiene el máximo de 5 direcciones permitidas');
      }

      return await DireccionRepository.create({
        IdUsuario: direccionData.IdUsuario,
        CallePrincipal: direccionData.CallePrincipal,
        Numeracion: direccionData.Numeracion,
        CalleSecundaria: direccionData.CalleSecundaria,
        Vecindario: direccionData.Vecindario,
        Ciudad: direccionData.Ciudad,
        Provincia: direccionData.Provincia,
        Pais: direccionData.Pais,
        Descripcion: direccionData.Descripcion // Agregar la nueva columna
      });
    } catch (error) {
      console.error('Error en servicio - createDireccion:', error);
      throw error;
    }
  }

  async deleteDireccion(id) {
    try {
      const deleted = await DireccionRepository.delete(id);
      if (!deleted) {
        throw new Error('Dirección no encontrada');
      }
      return true;
    } catch (error) {
      console.error('Error en servicio - deleteDireccion:', error);
      throw error;
    }
  }

  async getDireccionesByUserId(userId) {
    try {
      return await DireccionRepository.findByUserId(userId);
    } catch (error) {
      console.error('Error en servicio - getDireccionesByUserId:', error);
      throw error;
    }
  }
}
module.exports = new DireccionService();