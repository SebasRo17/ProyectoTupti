// controllers/BestSellersController.js
const { sequelize: db } = require('../../infrastructure/database/mysqlConnection');

const getBestSellers = async (req, res) => {
    try {
        const bestSellers = await db.query(`
            SELECT 
                p.Nombre AS Producto,
                p.Descripcion,
                p.Precio
            FROM 
                kardexproduct k
            JOIN 
                producto p ON k.IdProducto = p.IdProducto
            WHERE 
                k.Movimiento = 'Venta'
            GROUP BY 
                k.IdProducto
            ORDER BY 
                SUM(CAST(k.Cantidad AS SIGNED)) DESC
            LIMIT 10;
        `, { type: db.QueryTypes.SELECT });

        if (bestSellers.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }

        return res.status(200).json(bestSellers);
    } catch (error) {
        console.error('Error al obtener productos más vendidos:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = {
    getBestSellers
};