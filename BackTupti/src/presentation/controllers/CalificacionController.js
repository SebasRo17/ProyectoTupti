const { sequelize } = require('../../infrastructure/database/mysqlConnection');

class CalificacionController {
    async createCalificacion(req, res) {
        try {
            const { idProducto, idUsuario, comentario, puntuacion } = req.body;

            if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
                return res.status(400).json({ error: "La puntuación es requerida y debe estar entre 1 y 5" });
            }

            // Si hay comentario, verificar que no esté vacío
            if (comentario !== undefined && comentario.trim() === '') {
                return res.status(400).json({ error: "El comentario no puede estar vacío" });
            }

            const [result] = await sequelize.query(
                `INSERT INTO calificacion (IdProducto, IdUsuario, Comentario, Puntuacion, FechaReseña)
                 VALUES (?, ?, ?, ?, NOW())`,
                {
                    replacements: [idProducto, idUsuario, comentario || null, puntuacion],
                    type: sequelize.QueryTypes.INSERT
                }
            );

            res.status(201).json({ 
                id: result, 
                message: "Reseña creada exitosamente" 
            });
        } catch (error) {
            console.error('Error en createCalificacion:', error);
            res.status(500).json({ error: "Error al crear la reseña" });
        }
    }

    async getCalificaciones(req, res) {
        try {
            const { idProducto } = req.params;
            const calificaciones = await sequelize.query(
                `SELECT c.*, u.Nombre as NombreUsuario 
                FROM calificacion c
                JOIN usuario u ON c.IdUsuario = u.IdUsuario
                WHERE c.IdProducto = ?
                ORDER BY c.FechaReseña DESC`,
                {
                    replacements: [idProducto],
                    type: sequelize.QueryTypes.SELECT
                }
            );
            
            // Enviar directamente el resultado de la consulta (que ya es un array)
            res.json(calificaciones);
        } catch (error) {
            console.error('Error en getCalificaciones:', error);
            res.status(500).json({ error: "Error al obtener las reseñas" });
        }
    }
}

module.exports = new CalificacionController();
