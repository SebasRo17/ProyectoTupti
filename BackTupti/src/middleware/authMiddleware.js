const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    console.group('🔑 Verificación de Autenticación');
    try {
        console.log('Headers completos:', req.headers);
        console.log('Authorization header:', req.headers.authorization);

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.error('❌ No se encontró header de autorización');
            return res.status(401).json({
                error: 'Token no proporcionado',
                details: 'No se encontró el header Authorization'
            });
        }

        if (!authHeader.startsWith('Bearer ')) {
            console.error('❌ Formato de token inválido');
            return res.status(401).json({
                error: 'Token inválido',
                details: 'El token debe ser de tipo Bearer'
            });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token extraído:', token.substring(0, 20) + '...');

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('✅ Token decodificado exitosamente:', decoded);
            req.user = decoded;
            next();
        } catch (jwtError) {
            console.error('❌ Error verificando JWT:', jwtError);
            return res.status(401).json({
                error: 'Token inválido',
                details: jwtError.message
            });
        }
    } catch (error) {
        console.error('❌ Error general en middleware:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    } finally {
        console.groupEnd();
    }
};

module.exports = authMiddleware;
