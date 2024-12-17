const {sequelize: db} = require('../../infrastructure/database/mysqlConnection');

const getCategoryProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryProducts = await db.query(`
            SELECT 
                p.IdProducto, 
                p.Nombre AS Producto, 
                p.Descripcion, 
                p.Precio, 
                p.Stock,
                GROUP_CONCAT(DISTINCT pi.ImagenUrl) AS Imagenes
            FROM 
                producto p
                INNER JOIN tipoproducto tp ON p.IdTipoProducto = tp.IdTipoProducto
                LEFT JOIN productoImagen pi ON p.IdProducto = pi.IdProducto
            WHERE 
                tp.IdTipoProducto = :categoryId
            GROUP BY 
                p.IdProducto, p.Nombre, p.Descripcion, p.Precio, p.Stock;
        `, {
            replacements: { categoryId: id },
            type: db.QueryTypes.SELECT
        });

        if (!categoryProducts || categoryProducts.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos en esta categoría' });
        }
        
        return res.status(200).json(categoryProducts);
    } catch (error) {
        console.error('Error al obtener productos por categoría:', error);
        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {getCategoryProducts};