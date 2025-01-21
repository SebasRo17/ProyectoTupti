const { sequelize } = require('../database/mysqlConnection');
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
        const resultado = await Direccion.update(
          { Activo: 0 },
          { where: { IdDireccion: id } }
        );
        return resultado[0] > 0;
      } catch (error) {
        console.error('Error en repositorio - delete:', error);
        throw error;
      }
    }


    async findByUserId(userId) {
      try {
        return await Direccion.findAll({
          where: { 
            IdUsuario: userId,
            Activo: 1
          }
        });
      } catch (error) {
        console.error('Error en repositorio - findByUserId:', error);
        throw error;
      }
    }
    async findById(idDireccion) {
      try {
        return await Direccion.findByPk(idDireccion);
      } catch (error) {
        console.error('Error en repositorio - findById:', error);
        throw error;
      }
    }
    async updateSelectedStatus(idDireccion, idUsuario) {
      const t = await sequelize.transaction();
      try {
        // First set all user's addresses to not selected
        await Direccion.update(
          { EsSeleccionada: 0 },
          { 
            where: { IdUsuario: idUsuario },
            transaction: t
          }
        );
    
        // Then set the specified address as selected
        await Direccion.update(
          { EsSeleccionada: 1 },
          { 
            where: { IdDireccion: idDireccion },
            transaction: t
          }
        );
    
        await t.commit();
        return true;
      } catch (error) {
        await t.rollback();
        throw error;
      }
    }
    async obtenerDireccionSeleccionada(idUsuario) {
      try {
        const direccion = await Direccion.findOne({
          where: {
            IdUsuario: idUsuario,
            EsSeleccionada: 1,
            Activo: 1
          }
        });
  
        return direccion;
      } catch (error) {
        console.error('Error en repositorio - obtenerDireccionSeleccionada:', error);
        throw error;
      }
    }
  }
  module.exports = new DireccionRepositoryImpl();