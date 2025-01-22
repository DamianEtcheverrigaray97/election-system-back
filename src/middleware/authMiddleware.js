const jwt = require('jsonwebtoken');

module.exports = {
    verifyToken : (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                status: 'error',
                error: 'Access denied. No token provided.',
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.admin = decoded; // Decodificar token y agregar admin a la solicitud
            next(); // Continuar al siguiente middleware o controlador
        } catch (err) {
            return res.status(400).json({
                status: 'error',
                error: 'Invalid token',
            });
        }
    }
}

