const { Op } = require('sequelize');
const Descuento = require('../../domain/models/Descuento');
const Producto = require('../../domain/models/Producto');
const TipoProducto = require('../../domain/models/TipoProducto');

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
  async getAllDiscountsWithDetails() {
    try {
      return await Descuento.findAll({
        include: [
          {
            model: Producto,
            as: 'Producto',
            attributes: ['Nombre'],
            required: false
          },
          {
            model: TipoProducto,
            as: 'TipoProducto',
            attributes: ['detalle'],
            required: false
          }
        ]
      });
    } catch (error) {
      console.error('Error getting discounts:', error);
      throw error;
    }
  }
  async updateDiscount(idDescuento, data) {
    try {
      const [updated] = await Descuento.update(
        {
          Porcentaje: data.porcentaje,
          FechaInicio: data.fechaInicio,
          FechaFin: data.fechaFin,
          Activo: data.activo
        },
        {
          where: { IdDescuento: idDescuento }
        }
      );
      return updated > 0;
    } catch (error) {
      throw new Error(`Error updating discount: ${error.message}`);
    }
  }
  async delete(id) {
    try {
      const deleted = await Descuento.destroy({
        where: { IdDescuento: id }
      });
      return deleted > 0;
    } catch (error) {
      console.error('Error eliminando descuento:', error);
      throw error;
    }
  }
}

module.exports = DescuentoRepository;