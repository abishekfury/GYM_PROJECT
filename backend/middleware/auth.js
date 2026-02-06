const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Generate JWT token
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { 
        expiresIn: '24h',
        issuer: 'gym-management-system'
    });
};

// Verify JWT token middleware
const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'Access denied. No valid token provided.' 
            });
        }
        
        const token = authHeader.substring(7); // Remove "Bearer " prefix
        
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Check if admin still exists and is active
        const admin = await Admin.findById(decoded.id).select('-password');
        if (!admin || !admin.isActive) {
            return res.status(401).json({ 
                error: 'Access denied. Admin account not found or inactive.' 
            });
        }
        
        req.admin = admin;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token expired. Please login again.' 
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: 'Invalid token.' 
            });
        }
        
        res.status(400).json({ 
            error: 'Token verification failed.' 
        });
    }
};

// Admin only middleware (for future role-based access)
const adminOnly = (req, res, next) => {
    if (req.admin.role !== 'admin' && req.admin.role !== 'superadmin') {
        return res.status(403).json({ 
            error: 'Access denied. Admin privileges required.' 
        });
    }
    next();
};

module.exports = {
    generateToken,
    authenticateAdmin,
    adminOnly
};