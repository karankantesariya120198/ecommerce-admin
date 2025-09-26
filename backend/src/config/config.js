require('dotenv').config();

module.exports = {
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    },
    refreshToken: {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
    },
    cors: {
        origin: process.env.CORS_ORIGIN || '*'
    },
    rateLimit: {
        max: parseInt(process.env.RATE_LIMIT_MAX) || 100
    }
}