const { create } = require('axios');
const Product = require('../../domain/models/Producto');

class ProductRepositoryImpl{
    async findId(productId){
        try{
            const product = await Product.findByPk(productId);
            if(!product){
                throw new Error('Producto no encontrado');
            }
            return product;
        }catch(error){
                throw new Error('Error al buscar el producto');
            }
        }

    async create(productData){
        try{
            const product = await Product.create({
                Nombre: productData.Nombre,
                Precio: productData.Precio,
                Descripcion: productData.Descripcion,
                IdTipoProducto: productData.IdTipoProducto,
                Stock: productData.Stock || 0
            });
            return product;
        }catch(error){
            console.error('Error detallado:', error);
            throw new Error(`Error al crear el producto: ${error.message}`);
        }
    }

    async update(productId, productData){
        try {
            const [updated] = await Product.update(productData, {
                where: { IdProducto: productId }
            });
            if (updated === 0) {
                throw new Error('Producto no encontrado');
            }
            return await Product.findByPk(productId);
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }

    async delete(productId){
        try {
            const deleted = await Product.destroy({
                where: { IdProducto: productId }
            });
            if (!deleted){
                throw new Error('Producto no encontrado');
            }
            return true;
        }catch(error){
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }
}

module.exports = ProductRepositoryImpl;