const { create } = require('axios');
const Product = require('../../domain/models/Producto');
const { Op } = require('sequelize');
const TipoProducto = require('../../domain/models/TipoProducto');
const ProductoImagen = require('../../domain/models/ProductoImagen');
const Descuento = require('../../domain/models/Descuento');
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
        const currentDate = new Date();
  
        // Filtros existentes
        if (filters.Nombre) {
          whereCondition.Nombre = { [Op.like]: `%${filters.Nombre}%` };
        }
  
        if (filters.PrecioMin !== undefined && filters.PrecioMax !== undefined) {
          whereCondition.Precio = {
            [Op.between]: [filters.PrecioMin, filters.PrecioMax]
          };
        }
  
        if (filters.IdTipoProducto) {
          whereCondition.IdTipoProducto = filters.IdTipoProducto;
        }
  
        // Primero obtenemos los productos
        const productos = await Product.findAll({
          ...(Object.keys(whereCondition).length > 0 ? { where: whereCondition } : {}),
          attributes: ['IdProducto', 'Nombre', 'Precio', 'IdTipoProducto'],
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
  
        // Obtenemos los descuentos activos por producto
        const descuentosProducto = await Descuento.findAll({
          where: {
            Activo: true,
            FechaInicio: { [Op.lte]: currentDate },
            FechaFin: { [Op.gte]: currentDate },
            IdProducto: {
              [Op.in]: productos.map(p => p.IdProducto)
            }
          },
          attributes: ['IdProducto', 'Porcentaje']
        });
  
        // Obtenemos los descuentos activos por tipo de producto
        const descuentosTipo = await Descuento.findAll({
          where: {
            Activo: true,
            FechaInicio: { [Op.lte]: currentDate },
            FechaFin: { [Op.gte]: currentDate },
            IdTipoProducto: {
              [Op.in]: productos.map(p => p.IdTipoProducto)
            }
          },
          attributes: ['IdTipoProducto', 'Porcentaje']
        });
  
        // Crear mapas para búsqueda rápida
        const descuentosPorProducto = new Map(
          descuentosProducto.map(d => [d.IdProducto, parseFloat(d.Porcentaje)])
        );
  
        const descuentosPorTipo = new Map(
          descuentosTipo.map(d => [d.IdTipoProducto, parseFloat(d.Porcentaje)])
        );
  
        // Procesar cada producto para agregar información de descuento
        const productosConDescuento = productos.map(producto => {
          const productoJSON = producto.toJSON();
          
          // Primero verificar si hay descuento específico para el producto
          let descuento = null;
          if (descuentosPorProducto.has(productoJSON.IdProducto)) {
            descuento = descuentosPorProducto.get(productoJSON.IdProducto);
          } else if (descuentosPorTipo.has(productoJSON.IdTipoProducto)) {
            // Si no hay descuento específico, buscar descuento por tipo
            descuento = descuentosPorTipo.get(productoJSON.IdTipoProducto);
          }
  
          // Agregar información de descuento si existe
          if (descuento) {
            const precioOriginal = parseFloat(productoJSON.Precio);
            const descuentoAmount = (precioOriginal * descuento) / 100;
            const precioConDescuento = precioOriginal - descuentoAmount;
  
            return {
              ...productoJSON,
              descuento: {
                porcentaje: descuento,
                precioOriginal: precioOriginal,
                precioConDescuento: precioConDescuento.toFixed(2)
              }
            };
          }
  
          return productoJSON;
        });
  
        return productosConDescuento;
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