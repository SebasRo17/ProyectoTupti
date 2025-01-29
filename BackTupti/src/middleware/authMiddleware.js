const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    console.group('🔑 Verificación de Token');
    try {
        const authHeader = req.headers.authorization;
        console.log('Headers recibidos:', {
            auth: authHeader?.substring(0, 30) + '...',
            contentType: req.headers['content-type']
        });

        if (!authHeader?.startsWith('Bearer ')) {
            console.error('❌ Header de autorización inválido');
            return res.status(401).json({
                error: 'Token no proporcionado o formato inválido'
            });
        }

        const token = authHeader.split(' ')[1];
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token decodificado:', {
                IdUsuario: decoded.IdUsuario,
                Email: decoded.Email,
                CodigoUs: decoded.CodigoUs,
                roleName: decoded.roleName
            });

            // Verificar que el token tiene la estructura correcta
            if (!decoded.IdUsuario || !decoded.Email || !decoded.CodigoUs) {
                console.error('❌ Token no contiene los campos requeridos');
                return res.status(401).json({
                    error: 'Token inválido',
                    details: 'Estructura del token incorrecta'
                });
            }

            req.user = decoded;
            console.log('✅ Token válido para usuario:', decoded.IdUsuario);
            next();
        } catch (jwtError) {
            console.error('❌ Error al verificar JWT:', jwtError);
            return res.status(401).json({
                error: 'Token inválido',
                details: jwtError.message
            });
        }
    } catch (error) {
        console.error('❌ Error general:', error);
        res.status(500).json({
            error: 'Error del servidor',
            details: error.message
        });
    } finally {
        console.groupEnd();
    }
};

module.exports = authMiddleware;
