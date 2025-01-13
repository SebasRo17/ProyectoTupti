const { Op } = require('sequelize');
const Descuento = require('../../domain/models/Descuento');

class DescuentoRepository {
  async create(descuentoData) {
    try {
      return await Descuento.create(descuentoData);
    } catch (error) {
      console.error('Error creando descuento:', error);
      throw error;
    }
  }

  async update(id, descuentoData) {
    try {
      const descuento = await Descuento.findByPk(id);
      if (!descuento) {
        throw new Error('Descuento no encontrado');
      }
      return await descuento.update(descuentoData);
    } catch (error) {
      console.error('Error actualizando descuento:', error);
      throw error;
    }
  }

  async findActiveDiscount(idProducto, idTipoProducto) {
    try {
  
      const descuento = await Descuento.findOne({
        where: {
          [Op.or]: [
            { IdProducto: idProducto },
            { IdTipoProducto: idTipoProducto }
          ],
          Activo: true,
          FechaInicio: { [Op.lte]: new Date() },
          FechaFin: { [Op.gte]: new Date() }
        }
      });
  
      return descuento;
    } catch (error) {
      console.error('Error al buscar el descuento activo:', error);
      throw error;
    }
  }
}

module.exports = DescuentoRepository;