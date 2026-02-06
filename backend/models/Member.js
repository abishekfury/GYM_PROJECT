const mongoose = require('mongoose');

// Member Schema
const memberSchema = new mongoose.Schema({
    memberCode: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    membershipPlan: {
        type: String,
        required: true,
        enum: ['Monthly', 'Quarterly', '6 Months', 'Yearly']
    },
    planAmount: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Cash', 'GPay', 'PhonePe', 'Paytm', 'Bank Transfer']
    },
    paymentStatus: {
        type: String,
        default: 'Paid',
        enum: ['Paid', 'Pending', 'Partial']
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    },
    address: {
        type: String
    },
    emergencyContact: {
        name: String,
        phone: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;