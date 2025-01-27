const CarritoService = require('../../aplication/services/CarritoService');

class CarritoController {
  async agregarProductoACarrito(req, res) {
    try {
      const { idUsuario, idProducto, cantidad } = req.body;

      if (!idUsuario || !idProducto || !cantidad) {
        return res.status(400).json({ 
          mensaje: 'Faltan datos requeridos (idUsuario, idProducto, cantidad)' 
        });
      }

      const resultado = await CarritoService.agregarProductoACarrito(
        idUsuario,
        idProducto,
        cantidad
      );
      
      res.status(200).json(resultado);
    } catch (error) {
      console.error('Error en el controlador del carrito:', error);
      res.status(500).json({ 
        mensaje: 'Error al agregar producto al carrito' 
      });
    }
  }
  async actualizarEstado(req, res) {
    try {
      const { id } = req.params; 
      const { estado } = req.body; 

      const resultado = await CarritoService.actualizarEstado(id, estado);
      res.json(resultado);
    } catch (error) {
      console.error('Error en el controlador al actualizar el estado del carrito:', error);
      res.status(500).json({ message: error.message });
    }
  }
  async getActiveCarritoByUserId(req, res) {
    try {
      const idUsuario = req.params.idUsuario;
      const carrito = await CarritoService.getActiveCarritoByUserId(idUsuario);
      
      if (!carrito) {
        return res.status(404).json({ 
          message: 'No se encontró un carrito activo para este usuario' 
        });
      }
      
      res.json(carrito);
    } catch (error) {
      console.error('Error en el controlador de carrito:', error);
      res.status(500).json({ message: 'Error al obtener el carrito' });
    }
  }
  async obtenerTotalesCarrito(req, res) {
    try {
      const { idCarrito } = req.params;
      const totales = await CarritoService.calcularTotalesCarrito(idCarrito);
      res.status(200).json(totales);
    } catch (error) {
      console.error('Error en controlador:', error);
      res.status(500).json({ 
        message: 'Error al obtener totales del carrito',
        error: error.message 
      });
    }
  }
}

module.exports = new CarritoController();