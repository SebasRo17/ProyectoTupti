const { sequelize } = require('../../infrastructure/database/mysqlConnection');
const PedidoRepository = require('../../infrastructure/repositories/PedidoRepository');

class PedidoService {
  async getPedidoDetails(idPedido) {
    try {
      const detalles = await PedidoRepository.findPedidoDetailsById(idPedido);
      
      if (!detalles.length) {
        throw new Error('Pedido no encontrado');
      }

      // Filtrar items con cantidad > 0
      const detallesValidos = detalles.filter(item => item.Cantidad > 0);

      // Calcular totales y organizar la respuesta
      const resumen = {
        idPedido: detalles[0].IdPedido,
        items: detallesValidos.map(item => {
          const subtotal = parseFloat(item.PrecioProducto) * item.Cantidad;
          const descuento = subtotal * (parseFloat(item.PorcentajeDescuento) / 100);
          return {
            idCarritoDetalle: item.IdCarritoDetalle,
            producto: {
              nombre: item.NombreProducto,
              precio: parseFloat(item.PrecioProducto),
              cantidad: item.Cantidad,
              precioUnitario: parseFloat(item.PrecioUnitario),
              subtotal: subtotal,
              descuento: descuento
            },
            impuesto: {
              nombre: item.NombreImpuesto,
              porcentaje: parseFloat(item.PorcentajeImpuesto)
            }
          };
        }),
        totales: {
          subtotal: detallesValidos.reduce((acc, item) => 
            acc + (parseFloat(item.PrecioProducto) * item.Cantidad), 0),
          cantidadItems: detallesValidos.reduce((acc, item) => acc + item.Cantidad, 0),
          descuentos: detallesValidos.reduce((acc, item) => {
            const subtotalItem = parseFloat(item.PrecioProducto) * item.Cantidad;
            return acc + (subtotalItem * parseFloat(item.PorcentajeDescuento) / 100);
          }, 0),
          impuestos: detallesValidos.reduce((acc, item) => 
            acc + parseFloat(item.MontoImpuesto), 0)
        }
      };

      // Calcular total final
      resumen.totales.total = resumen.totales.subtotal - resumen.totales.descuentos + resumen.totales.impuestos;

      return resumen;
    } catch (error) {
      console.error('Error en el servicio de pedidos:', error);
      throw error;
    }
  }
  async getPedidoByCarrito(idCarrito) {
    try {
      const pedido = await PedidoRepository.findByCarritoId(idCarrito);
      
      if (!pedido) {
        throw new Error('Pedido no encontrado para este carrito');
      }

      return {
        idPedido: pedido.IdPedido,
        idUsuario: pedido.IdUsuario,
        idDireccion: pedido.Direccion_IdDireccion,
        estado: pedido.Estado,
        idCarrito: pedido.IdCarrito
      };
    } catch (error) {
      console.error('Error en el servicio de pedidos:', error);
      throw error;
    }
  }

  async createPedido(pedidoData) {
    try {
      return await PedidoRepository.create(pedidoData);
    } catch (error) {
      console.error('Error en PedidoService - createPedido:', error);
      throw error;
    }
  }
  async getPedidoById(id) {
    try {
      return await PedidoRepository.findById(id);
    } catch (error) {
      console.error('Error en PedidoService - getPedidoById:', error);
      throw error;
    }
  }
  async getAllPedidos() {
    try {
      return await PedidoRepository.findAll();
    } catch (error) {
      console.error('Error en PedidoService - getAllPedidos:', error);
      throw error;
    }
  }
  async updatePedido(id, pedidoData) {
    try {
      return await PedidoRepository.update(id, pedidoData);
    } catch (error) {
      console.error('Error en PedidoService - updatePedido:', error);
      throw error;
    }
  }
  async deletePedido(id) {
    try {
      return await PedidoRepository.delete(id);
    } catch (error) {
      console.error('Error en PedidoService - deletePedido:', error);
      throw error;
    }
  }

  async getLastPedidoByUserId(idUsuario) {
    try {
      const pedido = await PedidoRepository.findLastByUserId(idUsuario);
      if (!pedido) {
        throw new Error('No se encontró pedido para este usuario');
      }
      return pedido;
    } catch (error) {
      console.error('Error en servicio:', error);
      throw error;
    }
  }

  async getPedidoFullDetails(idPedido) {
    try {
      const detalles = await PedidoRepository.findPedidoFullDetails(idPedido);
      
      if (!detalles.length) {
        throw new Error('Pedido no encontrado');
      }

      // Agrupar los productos del pedido
      const productos = detalles.map(item => ({
        idProducto: item.IdProducto,
        nombreProducto: item.NombreProducto,
        cantidad: item.Cantidad,
        precioUnitario: item.PrecioUnitario
      }));

      // Construir la respuesta con los datos agrupados
      const respuesta = {
        pedido: {
          idPedido: detalles[0].IdPedido,
          estado: detalles[0].Estado,
          fechaPedido: detalles[0].CarritoFecha
        },
        usuario: {
          nombre: detalles[0].Nombre,
          email: detalles[0].Email
        },
        direccion: {
          callePrincipal: detalles[0].CallePrincipal,
          numeracion: detalles[0].Numeracion,
          calleSecundaria: detalles[0].CalleSecundaria,
          vecindario: detalles[0].Vecindario,
          ciudad: detalles[0].Ciudad
        },
        productos: productos
      };

      return respuesta;
    } catch (error) {
      console.error('Error en el servicio al obtener detalles completos del pedido:', error);
      throw error;
    }
  }
}

module.exports = new PedidoService();