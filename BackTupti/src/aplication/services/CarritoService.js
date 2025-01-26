const CarritoRepository = require('../../infrastructure/repositories/CarritoRepositoryImpl');
const ProductoRepository = require('../../infrastructure/repositories/ProductRepositoryImpl'); // Asumiendo que existe

class CarritoService {
    async agregarProductoACarrito(idUsuario, idProducto, cantidad) {
        try {
          // Buscar el carrito activo del usuario
          let carritoActivo = await CarritoRepository.buscarCarritoActivoPorUsuario(idUsuario);
    
          // Si no hay carrito activo o el último está comprado/abandonado, crear uno nuevo
          if (!carritoActivo) {
            carritoActivo = await CarritoRepository.crearCarrito(idUsuario);
          }
    
          // Obtener el producto y su precio
          const producto = await ProductoRepository.buscarPorId(idProducto);
          if (!producto) {
            throw new Error('Producto no encontrado');
          }
    
          // Verificar stock disponible
          if (producto.Stock < cantidad) {
            throw new Error('Stock insuficiente');
          }
    
          // Verificar si el producto ya existe en el carrito
          const detalleExistente = await CarritoRepository.buscarDetalleCarritoPorProducto(
            carritoActivo.IdCarrito,
            idProducto
          );
    
          if (detalleExistente) {
            // Verificar stock para la nueva cantidad total
            const nuevaCantidad = detalleExistente.Cantidad + cantidad;
            if (producto.Stock < nuevaCantidad) {
              throw new Error('Stock insuficiente para la cantidad total');
            }
            
            // Actualizar la cantidad si el producto ya existe
            await CarritoRepository.actualizarCantidadDetalleCarrito(
              detalleExistente.IdCarritoDetalle,
              nuevaCantidad
            );
            return { mensaje: 'Cantidad actualizada en el carrito' };
          }
    
          // Agregar nuevo detalle al carrito
          await CarritoRepository.agregarProductoACarrito({
            IdCarrito: carritoActivo.IdCarrito,
            IdProducto: idProducto,
            Cantidad: cantidad,
            PrecioUnitario: producto.Precio
          });
    
          return { mensaje: 'Producto agregado al carrito exitosamente' };
        } catch (error) {
          console.error('Error en el servicio del carrito:', error);
          throw error;
        }
      }
      async actualizarEstado(IdCarrito, nuevoEstado) {
        if (!['COMPRADO', 'ABANDONADO'].includes(nuevoEstado)) {
          throw new Error('Estado no válido');
        }
    
        const filasAfectadas = await CarritoRepository.updateEstado(IdCarrito, nuevoEstado);
    
        if (filasAfectadas === 0) {
          throw new Error('Carrito no encontrado o no se pudo actualizar');
        }
    
        return { message: `Carrito actualizado a estado: ${nuevoEstado}` };
      }
      async getActiveCarritoByUserId(idUsuario) {
        try {
          return await CarritoRepository.findActiveCarritoByUserId(idUsuario);
        } catch (error) {
          console.error('Error en el servicio de carrito:', error);
          throw error;
        }
      }
      async calcularTotalesCarrito(idCarrito) {
        try {
          const detalles = await CarritoRepository.obtenerDetallesConImpuestos(idCarrito);
          
          const resumen = {
            subtotal: 0,
            impuestoTotal: 0,
            total: 0,
            items: detalles.map(item => ({
              idProducto: item.IdProducto,
              nombre: item.NombreProducto || 'Producto sin nombre',
              cantidad: item.Cantidad,
              precioUnitario: parseFloat(item.PrecioUnitario),
              subtotal: parseFloat(item.Subtotal),
              impuesto: {
                nombre: item.NombreImpuesto || 'Sin impuesto',
                porcentaje: parseFloat(item.PorcentajeImpuesto || 0),
                monto: parseFloat(item.MontoImpuesto || 0)
              }
            }))
          };
    
          resumen.subtotal = resumen.items.reduce((acc, item) => acc + item.subtotal, 0);
          resumen.impuestoTotal = resumen.items.reduce((acc, item) => acc + item.impuesto.monto, 0);
          resumen.total = resumen.subtotal + resumen.impuestoTotal;
    
          return resumen;
        } catch (error) {
          console.error('Error en servicio:', error);
          throw error;
        }
      }
}

module.exports = new CarritoService();