# 🚀 Gym Management System - Setup Guide for New Laptop

## 📋 Prerequisites

Before starting, ensure your new laptop has:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (Community Edition) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** (for cloning) - [Download here](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

## 🔧 Step-by-Step Setup

### Step 1: Install Required Software

#### Install Node.js
```bash
# Check if Node.js is installed
node --version
npm --version

# If not installed, download from nodejs.org
# Recommended: LTS version
```

#### Install MongoDB
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y mongodb

# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Windows: Download installer from MongoDB website
```

#### Start MongoDB Service
```bash
# Ubuntu/Linux
sudo systemctl start mongod
sudo systemctl enable mongod

# macOS
brew services start mongodb/brew/mongodb-community

# Windows: MongoDB starts automatically as service
```

### Step 2: Clone or Copy Project Files

#### Option A: If you have the project in Git
```bash
git clone <your-repository-url>
cd UHV
```

#### Option B: If copying files manually
1. Copy the entire project folder to your new laptop
2. Navigate to the project directory

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# If you get permission errors on Linux/Mac:
sudo npm install
```

#### Configure Environment Variables
Create/Update `.env` file in backend folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gym_management

# JWT Configuration
JWT_SECRET=fed2ab73ea85653703f399d8def3611f

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Email Configuration (Update with your Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-actual-email@gmail.com
EMAIL_APP_PASSWORD=your-16-character-app-password
ADMIN_EMAIL=admin@yourgym.com
GYM_EMAIL=info@yourgym.com
ADMIN_PANEL_URL=http://localhost:3000/admin/messages

# Razorpay Configuration (Optional)
RAZORPAY_KEY_ID=rzp_test_RUvUzOzsmWwf0g
RAZORPAY_KEY_SECRET=
```

#### Setup Database (First Time Only)
```bash
# Run database setup
node setup.js

# This will create admin user and initial data
```

### Step 4: Frontend Setup

```bash
# Navigate to client directory (open new terminal)
cd client

# Install dependencies
npm install
```

#### Configure Frontend Environment
Create/Update `.env` file in client folder:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY_ID=rzp_test_RUvUzOzsmWwf0g
```

### Step 5: Start the Application

#### Terminal 1: Start Backend
```bash
cd backend
npm start

# You should see:
# 🚀 Server started successfully
# 📡 Server running on port 5000
# 🌐 CORS enabled for: http://localhost:3000
```

#### Terminal 2: Start Frontend
```bash
cd client
npm start

# Browser will automatically open http://localhost:3000
```

## 🔐 Email Configuration (Important!)

### Gmail Setup for Email Notifications

1. **Enable 2-Factor Authentication**:
   - Go to your Google Account settings
   - Security → 2-Step Verification → Turn on

2. **Generate App Password**:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the 16-character password (no spaces)

3. **Update Backend .env**:
   ```env
   EMAIL_USER=your-actual-email@gmail.com
   EMAIL_APP_PASSWORD=abcd efgh ijkl mnop  # Your 16-char password
   ```

## 🔍 Troubleshooting Common Issues

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Port Already in Use
```bash
# Kill process on port 5000
sudo lsof -ti:5000 | xargs sudo kill -9

# Kill process on port 3000
sudo lsof -ti:3000 | xargs sudo kill -9
```

### Permission Issues (Linux/Mac)
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### CORS Errors
- Ensure backend is running on port 5000
- Ensure frontend is running on port 3000
- Check both .env files have correct URLs

## 📱 Access the Application

### User Interface
- **Homepage**: http://localhost:3000
- **Admin Login**: http://localhost:3000/manual-login
  - Username: `admin`
  - Password: `admin123`

### Admin Features
- Dashboard: View gym statistics
- Members: Add/Edit/Delete members
- Finance: Manage income and expenses
- Contact Messages: View inquiries

## 🗄️ Database Management

### View Database Content
```bash
# Connect to MongoDB shell
mongosh

# Switch to gym database
use gym_management

# View collections
show collections

# View members
db.members.find().pretty()

# View finance records
db.finances.find().pretty()
```

### Reset Database (If needed)
```bash
# In MongoDB shell
use gym_management
db.dropDatabase()

# Then run setup again
cd backend
node setup.js
```

## 🚨 Important Notes

### First Time Setup Checklist
- [ ] Node.js installed and working
- [ ] MongoDB installed and running
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Environment files configured
- [ ] Database setup completed (`node setup.js`)
- [ ] Both servers running (backend:5000, frontend:3000)
- [ ] Gmail app password configured (if using emails)

### File Structure Should Look Like:
```
UHV/
├── backend/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── setup.js
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── middleware/
├── client/
│   ├── .env
│   ├── package.json
│   ├── src/
│   └── public/
└── README.md
```

## 🔄 Regular Startup (After Initial Setup)

Once everything is set up, you only need to:

```bash
# Terminal 1
cd backend
npm start

# Terminal 2  
cd client
npm start
```

## 🆘 Need Help?

### Check Logs
- Backend logs: Check terminal where `npm start` is running
- Frontend logs: Check browser console (F12)
- MongoDB logs: `sudo tail -f /var/log/mongodb/mongod.log`

### Common Commands
```bash
# Check what's running on ports
netstat -tulpn | grep :5000
netstat -tulpn | grep :3000

# Restart MongoDB
sudo systemctl restart mongod

# Clear npm cache
npm cache clean --force
```

## 🎉 Success!

If everything is working correctly, you should see:
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:3000  
- ✅ Database connected successfully
- ✅ No CORS errors in browser console
- ✅ Able to login to admin panel

The system includes:
- Member management (CRUD operations)
- Finance tracking (Income/Expense)
- Contact message handling
- Payment processing
- Professional email notifications

Happy gym managing! 🏋️‍♂️