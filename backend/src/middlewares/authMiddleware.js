const jwt = require('jsonwebtoken');
const { jwt: jwtConfig, refreshToken } = require('../config/config');

exports.authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json('Authorization token required (Bearer token)');
        }

        const token = authHeader.split(' ')[1]; // Extract token from Authorization header
        jwt.verify(token, jwtConfig.secret, (err, decoded) => {
            if (err) {
                return res.status(401).json('Invalid token');
            }
            req.user = decoded; // Attach user information to request object
            next();
        });
    } catch (error) {
        console.error('Authentication error:', error.message);
        let errorMessage = 'Invalid token';
        if (error.name === 'TokenExpiredError') {
            errorMessage = 'Token expired';
        } else if (error.name === 'JsonWebTokenError') {
            errorMessage = 'Invalid token';
        }
        return res.status(401).json(errorMessage);
    }
};

// Optional: Role-based middleware
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json(`Access denied. Required roles: ${roles.join(', ')}`)
        }
        next();
    };
};

// For refresh token verification
exports.verifyRefreshToken = (token) => {
    return jwt.verify(token, (err, decoded) => {
        if (err) {
            return res.status(401).json('Invalid token');
        }
        req.user = decoded; // Attach user information to request object
    });
};