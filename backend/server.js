const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import configuration
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const financeRoutes = require('./routes/finance');
const memberRoutes = require('./routes/members');
const dashboardRoutes = require('./routes/dashboard');
const contactRoutes = require('./routes/contact');
const paymentRoutes = require('./routes/payments');

// Import middleware
const { authenticateAdmin } = require('./middleware/auth');

const app = express();

// Configuration
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const PORT = process.env.PORT || 5000;

// Global rate limiting
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests. Please try again later.'
    }
});

// Middleware
app.use(globalLimiter);
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Connect to Database
connectDB();

// Health check endpoint (public)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Gym Management API',
        version: '1.0.0'
    });
});

// Routes
// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes); // Public contact form
app.use('/api/payments', paymentRoutes); // Public payment endpoints

// Protected routes (require admin authentication)
app.use('/api/finance', authenticateAdmin, financeRoutes);
app.use('/api/members', authenticateAdmin, memberRoutes);
app.use('/api/dashboard', authenticateAdmin, dashboardRoutes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('❌ Global error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Server started successfully');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌐 CORS enabled for: ${ALLOWED_ORIGIN}`);
    console.log(`🔒 Admin authentication required for protected routes`);
    console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('💤 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('💤 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});