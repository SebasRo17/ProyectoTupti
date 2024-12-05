const ProductService = require('../../aplication/services/ProductService');

class ProductController {
    async getProducts(req,res) {
        try{
            const products = await ProductService.getIdProducts();
            res.json(products);
        }catch(error){
            console.error('Error en el controlador:', error);
            res.status(500).json({message: 'Error al obtener los productos'});
        }
    }

    async createProducts(req, res) {
        try {
            const productData = {
                IdProducto: req.body.IdProducto, // Agregar esta línea
                Nombre: req.body.Nombre,
                Precio: req.body.Precio,
                Descripcion: req.body.Descripcion,
                IdTipoProducto: req.body.IdTipoProducto,
                Stock: req.body.Stock
            };
            const newProduct = await ProductService.createProducts(productData);
            res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente',
                data: newProduct
            });
        } catch (error) {
            console.error('Error en el controlador:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Error al crear el producto'
            });
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
}

module.exports = new ProductController();