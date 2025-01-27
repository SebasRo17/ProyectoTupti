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
  async deleteProductoImagen(req, res) {
    try {
      const { idProductoImagen } = req.params;
      await ProductoImagenService.deleteProductoImagenById(idProductoImagen);
      res.status(204).send(); // No Content
    } catch (error) {
      console.error('Error en el controlador al eliminar imagen:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
  async getProductoImagenesByIdProducto(req, res) {
    try {
      const { idProducto } = req.params;
      const imagenes = await ProductoImagenService.getProductoImagenesByIdProducto(idProducto);
      res.status(200).json(imagenes);
    } catch (error) {
      console.error('Error en el controlador al obtener imágenes:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProductoImagenController();