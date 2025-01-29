const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        console.log('Verificando autorización:', req.headers.authorization);

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error en autenticación:', error);
        res.status(401).json({ error: 'Token inválido' });
    }
};

module.exports = authMiddleware;
