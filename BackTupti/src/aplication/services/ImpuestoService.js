const ImpuestoRepository = require('../../infrastructure/repositories/ImpuestoRepository');

class ImpuestoService {
  async getAllImpuestos() {
    try {
      return await ImpuestoRepository.findAll();
    } catch (error) {
      console.error('Error en el servicio al obtener impuestos:', error.message);
      throw error;
    }
  }

}

module.exports = new ImpuestoService();