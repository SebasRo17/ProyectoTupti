const ProductRepositoryImpl = require("../../infrastructure/repositories/ProductRepositoryImpl")
const Product = require("../../domain/models/Producto")
const ProductRepository = require('../../infrastructure/repositories/ProductRepository');

class ProductService {
    static async getIdProducts(productId) {
        try {
            if (!productId) {
                throw new Error('El ID del producto es requerido');
            }            
            const product = await this.productRepository.findId(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            console.error('Error en el servicio de Productos:', error.message);
            throw error;
        }
    }

    static async createProducts(productData) {
        try {
            // Validar campos requeridos
            if (!productData.IdProducto) {
                throw new Error('El ID del producto es requerido');
            }
            if (!productData.Nombre) {
                throw new Error('El nombre del producto es requerido');
            }
            if (!productData.Precio) {
                throw new Error('El precio del producto es requerido');
            }
            if (!productData.IdTipoProducto) {
                throw new Error('El tipo de producto es requerido');
            }

            const product = await this.productRepository.create(productData);
            return product;
        } catch (error) {
            console.error('Error al crear el producto:', error.message);
            throw error;
        }
    }

    static async updateProduct(productId, productData) {
        try {
            if (!productId) {
                throw new Error('El ID del producto es requerido');
            }

            // Validar que al menos un campo actualizable esté presente
            if (!productData || Object.keys(productData).length === 0) {
                throw new Error('Se requieren datos para actualizar el producto');
            }

            // Validar tipos de datos si se proporcionan
            if (productData.Precio && isNaN(productData.Precio)) {
                throw new Error('El precio debe ser un número válido');
            }
            if (productData.Stock && !Number.isInteger(productData.Stock)) {
                throw new Error('El stock debe ser un número entero');
            }

            const updatedProduct = await this.productRepository.update(productId, productData);
            return updatedProduct;
        } catch (error) {
            console.error('Error al actualizar el producto:', error.message);
            throw error;
        }
    }

    static async deleteProduct(productId) {
        try {
            if (!productId) {
                throw new Error('El ID del producto es requerido');
            }
            const deletedProduct = await this.productRepository.delete(productId);
            if (!deletedProduct) {
                throw new Error('No se pudo eliminar el producto');
            }
            return { message: 'Producto eliminado exitosamente' };
        } catch (error) {
            console.error('Error al eliminar el producto:', error.message);
            throw error;
        }
    }
    async getAllProducts(filters = {}) {
        try {
          return await ProductRepositoryImpl.findAll(filters);
        } catch (error) {
          console.error('Error en el servicio de productos:', error);
          throw error;
        }
      }
      async getProductDetails(idProducto) {
        try {
          return await ProductRepository.findProductDetailsById(idProducto);
        } catch (error) {
          console.error('Error en servicio:', error);
          throw error;
        }
      }
      async createProduct(productData) {
        try {
          // Validar campos requeridos
          if (!productData.Nombre) {
            throw new Error('El nombre del producto es requerido');
          }
          if (!productData.Precio) {
            throw new Error('El precio del producto es requerido');
          }
          if (!productData.IdTipoProducto) {
            throw new Error('El tipo de producto es requerido');
          }
          if (!productData.IdImpuesto) {
            throw new Error('El ID del impuesto es requerido');
          }
    
          const product = await ProductRepository.create(productData);
          return product;
        } catch (error) {
          console.error('Error en el servicio al crear producto:', error.message);
          throw error;
        }
      }
      async deleteProductoById(id) {
        const deleted = await ProductRepository.deleteProductoById(id);
        if (!deleted) {
          throw new Error('Producto no encontrado');
        }
        return deleted;
      }
    
}

module.exports = new ProductService();