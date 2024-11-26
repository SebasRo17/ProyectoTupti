const { sequelize: db } = require('../../infrastructure/database/mysqlConnection'); // Importa la conexión a la base de datos correctamente

const getProductImages = async (req, res) => {
    let { id } = req.params;
    id = parseInt(id, 10); // Convertir el id a un entero
    console.log(typeof id); // Debería mostrar 'number'

    try {
        const imagenes = await db.query(`
            SELECT i.ImagenURL
            FROM productoImagen i
            WHERE i.IdProducto = ?;
        `, { replacements: [id], type: db.QueryTypes.SELECT });

        if (imagenes.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(imagenes.map(img => img.ImagenURL));
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

module.exports = { getProductImages };