const CarritoDetalleRepository = require('../../infrastructure/repositories/carritoDetalleRepository');

class CarritoDetalleService {
  constructor() {
    this.carritoDetalleRepository = new CarritoDetalleRepository();
  }

  async deleteDetalle(id) {
    try {
      const resultado = await this.carritoDetalleRepository.delete(id);
      
      if (!resultado) {
        throw new Error('No se pudo eliminar el detalle del carrito');
      }

      return {
        success: true,
        message: 'Detalle de carrito eliminado exitosamente'
      };
      
    } catch (error) {
      console.error('Error en el servicio de carrito detalle:', error);
      throw error;
    }
  }
}

module.exports = new CarritoDetalleService();