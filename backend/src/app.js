const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Added for security headers
const morgan = require('morgan'); // Added for request logging
const rateLimit = require('express-rate-limit'); // Added for rate limiting
const app = express();
const knex = require('./db/knex');

app.get('/health', async (req, res) => {
    try {
        await knex.raw('SELECT 1');
        res.json({ 
            status: 'OK',
            database: 'Connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'Error', 
            database: 'Disconnected',
            error: error.message 
        });
    }
});

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging
app.use(morgan('combined'));

// Request limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);


app.use(express.json({ limit: '1000kb' }));

const authRoutes = require('../src/routes/authRoutes');
const categoryRoutes = require('../src/routes/categoryRoutes');
const subcategoryRoutes = require('../src/routes/subcategoryRoutes');
const productRoutes = require('../src/routes/productRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/products', productRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        error: 'Endpoint not found' 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ 
        success: false,
        error: 'Internal server error' 
    });
})

module.exports = app;
