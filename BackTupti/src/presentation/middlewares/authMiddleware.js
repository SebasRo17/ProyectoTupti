const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ 
                success: false, 
                message: 'No se proporcionó token de autenticación' 
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Formato de token inválido' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verificar que el token contenga el Email (con mayúscula)
        if (!decoded.Email) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido: no contiene email'
            });
        }

        // Asignar el email al formato esperado por el controlador
        req.user = {
            ...decoded,
            email: decoded.Email // Añadir la versión en minúscula para compatibilidad
        };

        // Log para debugging
        console.log('Token decodificado y normalizado:', req.user);
        
        next();
    } catch (error) {
        console.error('Error en autenticación:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expirado' 
            });
        }
        
        return res.status(401).json({ 
            success: false, 
            message: 'Token inválido',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = authMiddleware;
