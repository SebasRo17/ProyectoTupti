const ProductService = require('../../aplication/services/ProductService');

class ProductController {
    async getProducts(req, res) {
        try {
            const { id } = req.params; // Obtener el ID de los parámetros
            const products = await ProductService.getIdProducts(id);
            res.json(products);
        } catch(error) {
            console.error('Error en el controlador:', error);
            res.status(500).json({message: 'Error al obtener los productos'});
        }
    }

    async createProduct(req, res) {
        try {
          const productData = req.body;
          const product = await ProductService.createProduct(productData);
          res.status(201).json(product);
        } catch (error) {
          console.error('Error en el controlador al crear producto:', error.message);
          res.status(400).json({ error: error.message });
        }
      }
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const productData = {
                Nombre: req.body.Nombre,
                Precio: req.body.Precio,
                Descripcion: req.body.Descripcion,
                IdTipoProducto: req.body.IdTipoProducto,
                Stock: req.body.Stock
            };

            const updatedProduct = await ProductService.updateProduct(id, productData);
            res.status(200).json({
                success: true,
                message: 'Producto actualizado exitosamente',
                data: updatedProduct
            });
        } catch (error) {
            console.error('Error en el controlador:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Error al actualizar el producto'
            });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            await ProductService.deleteProduct(id);
            res.status(200).json({
                success: true,
                message: 'Producto eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error en el controlador:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Error al eliminar el producto'
            });
        }
    }
    async getProducts(req, res) {
        try {
          const { Nombre, PrecioMin, PrecioMax, IdTipoProducto } = req.query;
          
          const filters = {};
          
          // Solo agregar filtros si están presentes
          if (Nombre) filters.Nombre = Nombre;
          if (PrecioMin) filters.PrecioMin = parseFloat(PrecioMin);
          if (PrecioMax) filters.PrecioMax = parseFloat(PrecioMax);
          if (IdTipoProducto) filters.IdTipoProducto = parseInt(IdTipoProducto);
    
          const productos = await ProductService.getAllProducts(filters);
          res.json(productos);
        } catch (error) {
          console.error('Error en el controlador:', error);
          res.status(500).json({ message: 'Error al obtener productos' });
        }
      }
      async getProductDetails(req, res) {
        try {
          const { idProducto } = req.params;
          const product = await ProductService.getProductDetails(idProducto);
          
          if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
          }
          
          res.json({
            Nombre: product.Nombre,
            IdTipoProducto: product.IdTipoProducto,
            TipoProducto: product.TipoProducto.detalle
          });
        } catch (error) {
          console.error('Error en controlador:', error);
          res.status(500).json({ message: 'Error al obtener detalles del producto' });
        }
      }
      async deleteProducto(req, res) {
        try {
          const { id } = req.params;
          await ProductService.deleteProductoById(id);
          res.status(204).send(); // No Content
        } catch (error) {
          console.error('Error en el controlador al eliminar producto:', error.message);
          res.status(500).json({ error: error.message });
        }
      }
      async updatePartialProduct(req, res) {
        try {
          const { idProducto } = req.params;
          const updateData = req.body;
    
          const updatedProduct = await ProductService.updatePartialProduct(idProducto, updateData);
          res.json(updatedProduct);
        } catch (error) {
          console.error('Error en controlador al actualizar producto:', error);
          if (error.message === 'Producto no encontrado') {
            res.status(404).json({ message: error.message });
          } else {
            res.status(500).json({ message: 'Error al actualizar el producto' });
          }
        }
      }
}

module.exports = new ProductController();