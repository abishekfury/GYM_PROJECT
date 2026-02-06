const express = require('express');
const rateLimit = require('express-rate-limit');
const Admin = require('../models/Admin');
const { generateToken, authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        error: 'Too many login attempts. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Admin login
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validation
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Username and password are required' 
            });
        }
        
        // Find admin by username
        const admin = await Admin.findOne({ 
            username: username.toLowerCase() 
        });
        
        if (!admin) {
            return res.status(401).json({ 
                error: 'Invalid credentials' 
            });
        }
        
        if (!admin.isActive) {
            return res.status(401).json({ 
                error: 'Account is deactivated. Contact system administrator.' 
            });
        }
        
        // Check password
        await admin.comparePassword(password);
        
        // Generate token
        const token = generateToken(admin.toJWT());
        
        // Return success response
        res.json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                role: admin.role,
                lastLogin: admin.lastLogin
            }
        });
        
    } catch (error) {
        console.error('Login error:', error.message);
        
        // Generic error message for security
        res.status(401).json({ 
            error: error.message || 'Authentication failed' 
        });
    }
});

// Verify token and get admin info
router.get('/verify', authenticateAdmin, async (req, res) => {
    try {
        res.json({
            success: true,
            admin: {
                id: req.admin._id,
                username: req.admin.username,
                role: req.admin.role,
                lastLogin: req.admin.lastLogin
            }
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to verify token' 
        });
    }
});

// Admin logout (optional - for logging purposes)
router.post('/logout', authenticateAdmin, async (req, res) => {
    try {
        // In a more complex system, you might invalidate the token
        // For now, we just return success
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Logout failed' 
        });
    }
});

// Create default admin (only run once)
router.post('/setup', async (req, res) => {
    try {
        // Check if any admin exists
        const existingAdmin = await Admin.findOne();
        if (existingAdmin) {
            return res.status(400).json({ 
                error: 'Admin already exists. Cannot create default admin.' 
            });
        }
        
        // Create default admin
        const defaultAdmin = new Admin({
            username: 'admin',
            password: 'admin123', // This will be hashed automatically
            role: 'superadmin'
        });
        
        await defaultAdmin.save();
        
        res.json({
            success: true,
            message: 'Default admin created successfully',
            credentials: {
                username: 'admin',
                password: 'admin123'
            }
        });
    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({ 
            error: 'Failed to create default admin' 
        });
    }
});

module.exports = router;