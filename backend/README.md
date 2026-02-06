# Gym Management System - Backend

A clean, modular backend API for managing gym operations including members, finances, and admin authentication.

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── Admin.js             # Admin user model
│   ├── Finance.js           # Financial records model
│   └── Member.js            # Gym member model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── dashboard.js         # Dashboard statistics routes
│   ├── finance.js           # Financial management routes
│   └── members.js           # Member management routes
├── utils/
│   └── memberUtils.js       # Member-related utility functions
├── .env                     # Environment variables
├── package.json             # Project dependencies
├── server.js               # Main server file
└── setup.js                # Database setup script
```

## 🚀 Features

### Member Management
- Add, update, delete gym members
- Automatic expiry date calculation
- Payment status tracking
- Search by member code or ID

### Financial Management
- Income and expense tracking
- Automatic income generation from memberships
- Financial reports and summaries
- Category-wise organization

### Dashboard Analytics
- Total members count
- Active vs expired members
- Today's new registrations
- Monthly revenue statistics

### Authentication & Security
- JWT-based admin authentication
- Rate limiting
- CORS protection
- Input validation

## 📊 API Endpoints

### Public Routes
- `GET /api/health` - Health check
- `POST /api/auth/login` - Admin login
- `POST /api/auth/setup` - Initial admin setup

### Protected Routes (Require Admin Auth)

#### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Add new member
- `GET /api/members/:id` - Get member by ID
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member
- `GET /api/members/code/:code` - Get member by code
- `PUT /api/members/code/:code` - Update member by code
- `DELETE /api/members/code/:code` - Delete member by code

#### Finance
- `GET /api/finance/income` - Get income records
- `POST /api/finance/income` - Add income record
- `GET /api/finance/expenses` - Get expense records
- `POST /api/finance/expenses` - Add expense record
- `GET /api/finance/summary` - Get financial summary

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🛠️ Installation & Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/gym_management
   JWT_SECRET=your_super_secure_jwt_secret
   CORS_ORIGIN=http://localhost:3000
   PORT=5000
   NODE_ENV=development
   ```

3. **Database Setup**
   ```bash
   npm run setup
   ```

4. **Start Server**
   ```bash
   npm start
   ```

## 🔧 Utility Functions

### Member Utils (`utils/memberUtils.js`)
- `calculateExpiryDate(plan, startDate)` - Calculate membership expiry
- `determinePaymentStatus(paid, total)` - Determine payment status
- `generateMemberCode(name, phone)` - Generate unique member codes
- `formatCurrency(amount)` - Format currency display
- `isValidEmail(email)` - Email validation
- `isValidIndianPhone(phone)` - Indian phone number validation

## 📝 Models

### Member Model
- **memberCode**: Unique identifier
- **name**: Member's full name
- **phone**: Contact number
- **email**: Email address (optional)
- **membershipPlan**: Monthly/Quarterly/6 Months/Yearly
- **planAmount**: Total plan cost
- **paidAmount**: Amount paid
- **paymentMethod**: Cash/GPay/PhonePe/Paytm/Bank Transfer
- **paymentStatus**: Paid/Partial/Pending (auto-calculated)
- **joinDate**: Registration date
- **expiryDate**: Membership expiry (auto-calculated)
- **address**: Home address (optional)
- **emergencyContact**: Emergency contact info
- **isActive**: Member status

### Finance Models
- **Income**: Revenue tracking
- **Expense**: Cost tracking
- Both include categories, payment methods, and descriptions

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **JWT Authentication**: Secure admin access
- **CORS Protection**: Configurable origin restrictions
- **Input Validation**: Mongoose schema validation
- **Error Handling**: Comprehensive error responses

## 📈 Development Features

- **Clean Logging**: Emoji-enhanced console outputs
- **Graceful Shutdown**: Proper cleanup on server stop
- **Modular Architecture**: Separated concerns
- **Utility Functions**: Reusable business logic
- **Environment Configs**: Flexible deployment settings

## 🤝 Contributing

1. Follow the modular structure
2. Add new routes to appropriate files
3. Create utility functions for reusable logic
4. Update this README for new features
5. Maintain proper error handling

## 🆘 Troubleshooting

**Database Connection Issues:**
- Check MongoDB is running
- Verify MONGODB_URI in .env
- Ensure network connectivity

**Authentication Errors:**
- Verify JWT_SECRET is set
- Check token expiration
- Confirm admin user exists

**CORS Errors:**
- Update CORS_ORIGIN in .env
- Check frontend URL matches

---

Built with ❤️ for efficient gym management