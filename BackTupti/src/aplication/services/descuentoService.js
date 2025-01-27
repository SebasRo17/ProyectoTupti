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
  async getAllDiscounts() {
    try {
      const discounts = await this.descuentoRepository.getAllDiscountsWithDetails();
      return discounts.map(discount => ({
        nombre: discount.Producto?.Nombre || discount.TipoProducto?.detalle || 'N/A',
        estado: discount.Activo === 1,
        porcentaje: discount.Porcentaje,
        fechaInicio: discount.FechaInicio,
        fechaFin: discount.FechaFin
      }));
    } catch (error) {
      throw new Error(`Error in discount service: ${error.message}`);
    }
  }
  async getAllDiscounts() {
    try {
      const discounts = await this.descuentoRepository.getAllDiscountsWithDetails();
      
      return discounts.map(discount => {
        return {
          id: discount.IdDescuento,
          nombre: discount.Producto?.Nombre || discount.TipoProducto?.detalle || 'N/A',
          estado: Boolean(discount.Activo), // Convert 0/1 to boolean
          porcentaje: discount.Porcentaje,
          fechaInicio: discount.FechaInicio,
          fechaFin: discount.FechaFin
        };
      });
    } catch (error) {
      console.error('Error in getAllDiscounts:', error);
      throw new Error(`Error in discount service: ${error.message}`);
    }
  }
  async updateDiscount(idDescuento, data) {
    try {
      if (!idDescuento) throw new Error('ID de descuento es requerido');
      
      const updated = await this.descuentoRepository.updateDiscount(idDescuento, {
        porcentaje: data.porcentaje,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        activo: data.activo
      });

      if (!updated) throw new Error('Descuento no encontrado');
      return { success: true };
    } catch (error) {
      throw new Error(`Error updating discount: ${error.message}`);
    }
  }
  async deleteDescuento(id) {
    try {
      const result = await this.descuentoRepository.delete(id);
      if (!result) {
        throw new Error('Descuento no encontrado');
      }
      return result;
    } catch (error) {
      console.error('Error en el servicio al eliminar descuento:', error);
      throw error;
    }
  }
}

module.exports = DescuentoService;