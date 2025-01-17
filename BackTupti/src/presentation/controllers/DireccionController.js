const DireccionService = require('../../aplication/services/DireccionService');

class DireccionController {
  async createDireccion(req, res) {
    try {
      const direccion = await DireccionService.createDireccion(req.body);
      res.status(201).json(direccion);
    } catch (error) {
      console.error('Error en controlador - createDireccion:', error);

      if (error.message === 'El usuario no existe') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'El usuario ya tiene el máximo de 5 direcciones permitidas') {
        return res.status(400).json({ message: error.message });
      }
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ message: 'El usuario especificado no existe' });
      }

      res.status(500).json({ message: 'Error al crear la dirección' });
    }
  }

    async deleteDireccion(req, res) {
      try {
        await DireccionService.deleteDireccion(req.params.id);
        res.status(200).json({ message: 'Dirección eliminada exitosamente' });
      } catch (error) {
        console.error('Error en controlador - deleteDireccion:', error);
        if (error.message === 'Dirección no encontrada') {
          return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al eliminar la dirección' });
      }
    }

    async getDireccionesByUserId(req, res) {
      try {
        const direcciones = await DireccionService.getDireccionesByUserId(req.params.userId);
        res.json(direcciones);
      } catch (error) {
        console.error('Error en controlador - getDireccionesByUserId:', error);
        res.status(500).json({ message: 'Error al obtener las direcciones' });
      }
    }

    async updateSelectedAddress(req, res) {
      try {
        const { idDireccion } = req.params;
        await DireccionService.updateSelectedAddress(idDireccion);
        res.status(200).json({ 
          message: 'Dirección seleccionada actualizada exitosamente' 
        });
      } catch (error) {
        console.error('Error en controlador:', error);
        res.status(error.message === 'Dirección no encontrada' ? 404 : 500)
          .json({ message: error.message });
      }
    }

    async obtenerDireccionSeleccionada(req, res) {
      try {
        const { idUsuario } = req.params;
        const direccion = await DireccionService.obtenerDireccionSeleccionada(idUsuario);
        res.status(200).json(direccion);
      } catch (error) {
        console.error('Error en controlador:', error);
        res.status(404).json({ 
          message: error.message || 'Error al obtener la dirección seleccionada'
        });
      }
    }
  }
module.exports = new DireccionController();