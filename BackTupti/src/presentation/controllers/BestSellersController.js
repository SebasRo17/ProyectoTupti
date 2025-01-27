// controllers/BestSellersController.js
const { sequelize: db } = require('../../infrastructure/database/mysqlConnection');

const getBestSellers = async (req, res) => {
    try {
        
        const bestSellers = await db.query(`
            SELECT 
                p.IdProducto,
                p.Nombre AS Producto,
                p.Descripcion,
                p.IdTipoProducto,
                p.Precio,
                GROUP_CONCAT(i.ImagenURL) AS Imagenes
            FROM 
                producto p
            LEFT JOIN 
                productoImagen i ON p.IdProducto = i.IdProducto
            LEFT JOIN 
                kardexproduct k ON p.IdProducto = k.IdProducto AND k.Movimiento = 'Venta'  -- Filtrar solo ventas
            GROUP BY 
                p.IdProducto
            ORDER BY 
                SUM(CASE WHEN k.Movimiento = 'Venta' THEN CAST(k.Cantidad AS SIGNED) ELSE 0 END) DESC  -- Ordenar por las ventas
            LIMIT 15;
        `, { type: db.QueryTypes.SELECT });
        if (!bestSellers || bestSellers.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }

        return res.status(200).json(bestSellers);
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
};

module.exports = {
    getBestSellers
};