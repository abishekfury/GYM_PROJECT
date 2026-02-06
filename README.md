# Raju Rapse Gym Management System

A comprehensive gym management system with a professional public website and admin management panel, built with React and Node.js.

## 🌟 Features Overview

### 🌐 Public Gym Website
- **Professional Homepage**: Beautiful gym website with purple, white, and black theme
- **Services Showcase**: Weight training, cardio, personal training, group classes, nutrition guidance, supplements
- **Membership Plans**: Monthly, Quarterly, 6-month, and Yearly pricing options
- **Testimonials**: Customer reviews and ratings
- **Contact Information**: Location, hours, and contact details
- **Responsive Design**: Mobile-friendly with smooth animations

### 🔐 Admin Management System
- **Hidden Admin Access**: Admin login available at `/admin-login` route (not visible to public)
- **Member Management**: Complete registration, tracking, and membership management
- **Financial Tracking**: Automatic income from memberships and manual expense management
- **Dashboard Analytics**: Real-time statistics and financial summaries

## 🎨 Design Theme
- **Primary Colors**: Purple (#6a1b9a), Dark Purple (#4a148c)
- **Accent Colors**: White (#ffffff), Black (#000000)
- **Modern UI**: Material-UI components with custom purple theming
- **Animations**: Smooth transitions with Framer Motion

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
npm start  # Runs on http://localhost:5000
```

### Frontend Setup
```bash
cd client
npm install
npm start  # Runs on http://localhost:3000
```

## 📱 Application Routes

### Public Routes
- `/` - **Gym Website Homepage** (Default public view)
- `/admin-login` - **Admin Login** (Hidden route for gym management)

### Protected Admin Routes (Requires Login)
- `/admin` - Admin Dashboard
- `/admin/register` - Member Registration
- `/admin/members` - Members Directory  
- `/admin/finance` - Income & Expense Management

## 🏋️ Website Sections

### Homepage Features
1. **Hero Section**: Eye-catching banner with gym branding and call-to-action
2. **About Section**: Gym history, mission, and key statistics
3. **Services**: Detailed service offerings with icons and descriptions
4. **Pricing**: Membership plans with feature comparisons
5. **Testimonials**: Member reviews with ratings
6. **Contact**: Location, hours, and contact information

### Services Offered
- 💪 **Weight Training**: State-of-the-art equipment
- 🏃 **Cardio Workouts**: Modern cardio machines and programs
- 👨‍🏫 **Personal Training**: One-on-one certified trainer sessions
- 👥 **Group Classes**: Yoga, Zumba, HIIT activities
- 🥗 **Nutrition Guidance**: Diet plans and counseling
- 💊 **Supplements Store**: Premium fitness supplements

### Membership Plans
- **Monthly**: ₹2,000/month - Basic access and facilities
- **Quarterly**: ₹5,500/3 months - Includes group classes (Most Popular)
- **6 Months**: ₹10,000/6 months - Personal trainer sessions included
- **Yearly**: ₹18,000/year - All premium features and benefits

## 🔧 Admin Management Features

### Member Management
- **Registration**: Complete member onboarding with personal details
- **Directory**: Searchable member list with filtering options
- **Membership Tracking**: Plan management and renewal tracking
- **Payment Processing**: Automatic income generation from memberships

### Financial Management
- **Income Tracking**: Automatic records from member payments + manual entries
- **Expense Management**: Categorized expense tracking with payment methods
- **Financial Analytics**: Real-time profit/loss calculations and summaries
- **Reporting**: Monthly and yearly financial insights

### Dashboard Analytics
- **Member Statistics**: Total members, new registrations, active memberships
- **Financial Summaries**: Income, expenses, net profit calculations
- **Growth Metrics**: Membership growth and revenue trends
- **Quick Actions**: Fast access to common administrative tasks

## 🛠 Technical Stack

### Frontend
- **React 19.0.0**: Latest React with modern features
- **Material-UI 6.x**: Professional UI components with custom theming
- **Framer Motion**: Smooth animations and transitions
- **React Router**: Client-side routing and navigation
- **Date-fns**: Date manipulation and formatting

### Backend  
- **Node.js & Express**: RESTful API server
- **MongoDB & Mongoose**: Document database with object modeling
- **JWT Authentication**: Secure admin authentication
- **bcrypt**: Password hashing and security

## 📊 API Endpoints

### Public Access
- Website content served from React frontend

### Admin Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Token verification
- `POST /api/auth/logout` - Admin logout

### Member Management
- `GET /api/members` - Fetch all members
- `POST /api/members` - Register new member (auto-generates income)
- `PUT /api/members/:id` - Update member details
- `DELETE /api/members/:id` - Remove member

### Financial Management
- `GET /api/finance/income` - Get income records
- `POST /api/finance/income` - Add manual income
- `PUT /api/finance/income/:id` - Update income record
- `DELETE /api/finance/income/:id` - Delete income record
- `GET /api/finance/expenses` - Get expense records  
- `POST /api/finance/expenses` - Add expense
- `PUT /api/finance/expenses/:id` - Update expense
- `DELETE /api/finance/expenses/:id` - Delete expense
- `GET /api/finance/summary` - Financial analytics summary

## 🗂 Project Structure

```
raju-rapse-gym/
├── backend/
│   ├── models/
│   │   ├── Admin.js          # Admin authentication
│   │   ├── Member.js         # Member data model
│   │   └── Finance.js        # Income & Expense models
│   ├── routes/
│   │   ├── auth.js           # Admin authentication routes
│   │   ├── members.js        # Member management APIs
│   │   └── finance.js        # Financial management APIs
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   └── server.js             # Express server setup
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GymWebsite.js         # Public gym website
│   │   │   ├── LoginPage.js          # Admin login (CSS-only design)
│   │   │   ├── GymDashboard.js       # Admin dashboard
│   │   │   ├── MemberRegistration.js # Member registration form
│   │   │   ├── MembersList.js        # Members directory
│   │   │   └── IncomeExpenseManager.js # Financial management
│   │   ├── services/
│   │   │   └── api.js                # API client with auth
│   │   └── App.js                    # Main routing and theme
│   └── package.json
└── README.md
```

## 🎯 Usage Instructions

### For Public Users
1. Visit the website at `http://localhost:3000`
2. Browse gym information, services, and pricing
3. Contact gym for membership inquiries

### For Gym Administrators
1. Navigate to `http://localhost:3000/admin-login`
2. Login with admin credentials
3. Manage members, registrations, and finances through the admin panel
4. Access dashboard analytics and reports

## 🔑 Default Admin Access
- **Login Route**: `/admin-login` (hidden from public)
- **Username**: admin
- **Password**: admin123

**⚠️ Security Note**: Change default credentials in production environment!

## 🌈 Design Highlights
- **Purple Theme**: Professional gym branding with purple gradients
- **Responsive Layout**: Mobile-first design approach
- **Modern Animations**: Smooth hover effects and transitions
- **Professional Typography**: Clean, readable fonts and spacing
- **Intuitive Navigation**: Easy-to-use interface for all user levels

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
This project is licensed under the MIT License.

---

**Raju Rapse Gym Management System** - Transform Your Body • Transform Your Life • Transform Your Future