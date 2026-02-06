const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

const setupAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gym_management');
        
        console.log('Connected to MongoDB');
        
        // Check if admin already exists
        const existingAdmin = await Admin.findOne();
        if (existingAdmin) {
            console.log('❌ Admin already exists. Skipping setup.');
            console.log('Existing admin username:', existingAdmin.username);
            process.exit(0);
        }
        
        // Create default admin
        const defaultAdmin = new Admin({
            username: 'admin',
            password: 'admin123', // This will be hashed automatically
            role: 'superadmin'
        });
        
        await defaultAdmin.save();
        
        console.log('✅ Default admin created successfully!');
        console.log('┌─────────────────────────────────────┐');
        console.log('│         LOGIN CREDENTIALS           │');
        console.log('├─────────────────────────────────────┤');
        console.log('│ Username: admin                     │');
        console.log('│ Password: admin123                  │');
        console.log('└─────────────────────────────────────┘');
        console.log('⚠️  Please change the default password after first login!');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

// Run setup
setupAdmin();