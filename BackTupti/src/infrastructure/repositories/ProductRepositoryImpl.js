const { create } = require('axios');
const Product = require('../../domain/models/Producto');
const { Op } = require('sequelize');
const TipoProducto = require('../../domain/models/TipoProducto');
const ProductoImagen = require('../../domain/models/ProductoImagen');

class ProductRepositoryImpl {
  async findId(productId) {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product;
    } catch (error) {
      console.error('Error al buscar el producto:', error);
      throw error;
    }
  }

    async create(productData) {
        try {
            // Verificar si ya existe un producto con ese ID
            if (productData.IdProducto) {
                const existingProduct = await Product.findByPk(productData.IdProducto);
                if (existingProduct) {
                    throw new Error('Ya existe un producto con este ID');
                }
            }

            const product = await Product.create({
                IdProducto: productData.IdProducto,
                Nombre: productData.Nombre,
                Precio: productData.Precio,
                Descripcion: productData.Descripcion,
                IdTipoProducto: productData.IdTipoProducto,
                Stock: productData.Stock || 0
            });
            return product;
        } catch (error) {
            console.error('Error detallado:', error);
            throw new Error(`Error al crear el producto: ${error.message}`);
        }
    }

    async update(productId, productData) {
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

    async delete(productId) {
        try {
            const deleted = await Product.destroy({
                where: { IdProducto: productId }
            });
            if (!deleted) {
                throw new Error('Producto no encontrado');
            }
            return true;
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }
    async findAll(filters = {}) {
      try {
        const whereCondition = {};
    
        // Filtro por nombre (coincidencia parcial, opcional)
        if (filters.Nombre) {
          whereCondition.Nombre = { [Op.like]: `%${filters.Nombre}%` };
        }
    
        // Filtro por rango de precio (opcional)
        if (filters.PrecioMin !== undefined && filters.PrecioMax !== undefined) {
          whereCondition.Precio = {
            [Op.between]: [filters.PrecioMin, filters.PrecioMax]
          };
        }
    
        // Filtro por tipo de producto (opcional)
        if (filters.IdTipoProducto) {
          whereCondition.IdTipoProducto = filters.IdTipoProducto;
        }
    
        const productos = await Product.findAll({
          // Solo aplicar where si hay condiciones
          ...(Object.keys(whereCondition).length > 0 ? { where: whereCondition } : {}),
          attributes: ['IdProducto', 'Nombre', 'Precio', 'IdTipoProducto'], // Incluir IdTipoProducto
          include: [
            {
              model: TipoProducto,
              as: 'TipoProducto',
              attributes: ['detalle']
            },
            {
              model: ProductoImagen,
              as: 'Imagenes',
              attributes: ['ImagenUrl']
            }
          ]
        });
    
        return productos;
      } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
      }
      }
      async buscarPorId(id) {
        try {
          return await Product.findByPk(id);
        } catch (error) {
          console.error('Error al buscar producto por ID:', error);
          throw error;
        }
      }
}

module.exports = new ProductRepositoryImpl();