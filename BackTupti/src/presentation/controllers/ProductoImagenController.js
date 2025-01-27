const ProductoImagenService = require('../../aplication/services/ProductoImagenService');

class ProductoImagenController {
  async createProductoImagen(req, res) {
    try {
      const data = req.body;
      const productoImagen = await ProductoImagenService.createProductoImagen(data);
      res.status(201).json(productoImagen);
    } catch (error) {
      console.error('Error en el controlador al crear ProductoImagen:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = new ProductoImagenController();