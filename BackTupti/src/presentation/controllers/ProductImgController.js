const { sequelize: db } = require('../../infrastructure/database/mysqlConnection'); // Importa la conexión a la base de datos correctamente

const getProductImages = async (req, res) => {
    let { id } = req.params;
    id = parseInt(id, 10); // Convertir el id a un entero
    console.log(typeof id); // Debería mostrar 'number'

    try {
        const producto = await db.query(`
            SELECT 
                p.Nombre,
                p.Precio,
                p.Descripcion,
                i.ImagenURL
            FROM 
                producto p
            LEFT JOIN 
                productoImagen i ON p.IdProducto = i.IdProducto
            WHERE 
                p.IdProducto = ?;
        `, { replacements: [id], type: db.QueryTypes.SELECT });

        if (producto.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const resultado = {
            Nombre: producto[0].Nombre,
            Precio: producto[0].Precio,
            Descripcion: producto[0].Descripcion,
            Imagenes: producto.map(img => img.ImagenURL)
        };

        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

module.exports = { getProductImages };