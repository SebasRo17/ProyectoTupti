const DescuentoRepository = require('../../infrastructure/repositories/descuentoRepository');
const CarritoDetalleRepository = require('../../infrastructure/repositories/carritoDetalleRepository');
const ProductoRepository = require('../../infrastructure/repositories/ProductRepositoryImpl');

class DescuentoService {
  constructor() {
    this.descuentoRepository = new DescuentoRepository();
    this.carritoDetalleRepository = new CarritoDetalleRepository();
    this.productoRepository = ProductoRepository; // Usar la instancia directamente
  }

  async createDescuento(descuentoData) {
    try {
      if (descuentoData.IdTipoProducto && descuentoData.IdProducto) {
        throw new Error('Solo puede especificar IdTipoProducto o IdProducto, no ambos');
      }
      if (!descuentoData.IdTipoProducto && !descuentoData.IdProducto) {
        throw new Error('Debe especificar IdTipoProducto o IdProducto');
      }
      
      return await this.descuentoRepository.create(descuentoData);
    } catch (error) {
      console.error('Error en el servicio de descuentos:', error);
      throw error;
    }
  }

  async updateDescuento(id, descuentoData) {
    try {
      if (descuentoData.IdTipoProducto && descuentoData.IdProducto) {
        throw new Error('Solo puede especificar IdTipoProducto o IdProducto, no ambos');
      }
      
      return await this.descuentoRepository.update(id, descuentoData);
    } catch (error) {
      console.error('Error en el servicio de descuentos:', error);
      throw error;
    }
  }

  async calcularDescuentoCarrito(idCarrito) {
    try {
  
      const detallesCarrito = await this.carritoDetalleRepository.findByCarritoId(idCarrito);
      let descuentoTotal = 0;
      let detallesConDescuento = [];
  
      for (const detalle of detallesCarrito) {
        const producto = await this.productoRepository.findId(detalle.IdProducto);
        if (!producto) continue;
  
        const descuento = await this.descuentoRepository.findActiveDiscount(
          detalle.IdProducto,
          producto.IdTipoProducto
        );
  
        if (descuento) {
          const porcentaje = parseFloat(descuento.Porcentaje) / 100;
          const subtotal = detalle.PrecioUnitario * detalle.Cantidad;
          const descuentoMonto = subtotal * porcentaje;
          descuentoTotal += descuentoMonto;
  
          detallesConDescuento.push({
            producto: producto.Nombre,
            cantidad: detalle.Cantidad,
            precioUnitario: detalle.PrecioUnitario,
            descuentoPorcentaje: descuento.Porcentaje,
            descuentoMonto
          });
        }
      }
  
      return {
        descuentoTotal,
        detallesConDescuento
      };
    } catch (error) {
      console.error('Error calculando descuento del carrito:', error);
      throw error;
    }
  }
}

module.exports = DescuentoService;