const Impuesto = require('../../domain/models/Impuesto');

class ImpuestoRepository {
  async findAll() {
    try {
      return await Impuesto.findAll({
        attributes: ['IdImpuesto', 'Nombre', 'Porcentaje']
      });
    } catch (error) {
      console.error('Error en el repositorio al obtener impuestos:', error);
      throw error;
    }
  }

}

module.exports = new ImpuestoRepository();