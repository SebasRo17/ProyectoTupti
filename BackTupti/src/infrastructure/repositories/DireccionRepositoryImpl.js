const Direccion = require('../../domain/models/Direccion');

class DireccionRepositoryImpl {
    async countByUserId(userId) {
      try {
        return await Direccion.count({
          where: { IdUsuario: userId }
        });
      } catch (error) {
        console.error('Error en repositorio - countByUserId:', error);
        throw error;
      }
    }
  
    async create(direccionData) {
      try {
        return await Direccion.create(direccionData);
      } catch (error) {
        console.error('Error en repositorio - create:', error);
        throw error;
      }
    }
  
    async delete(id) {
      try {
        const resultado = await Direccion.destroy({
          where: { IdDireccion: id }
        });
        return resultado > 0;
      } catch (error) {
        console.error('Error en repositorio - delete:', error);
        throw error;
      }
    }
  
    async findByUserId(userId) {
      try {
        return await Direccion.findAll({
          where: { IdUsuario: userId }
        });
      } catch (error) {
        console.error('Error en repositorio - findByUserId:', error);
        throw error;
      }
    }
  }
  module.exports = new DireccionRepositoryImpl();
