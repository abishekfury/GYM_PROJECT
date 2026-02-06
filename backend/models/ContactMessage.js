const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'],
    default: null
  },
  subject: {
    type: String,
    trim: true,
    maxlength: 200,
    default: 'General Inquiry'
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000
  },
  messageType: {
    type: String,
    enum: ['contact', 'membership', 'inquiry', 'complaint', 'feedback'],
    default: 'contact'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'resolved'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    enum: ['homepage', 'contact_page', 'join_now', 'mobile_app'],
    required: true
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  isEmailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: {
    type: Date,
    default: null
  },
  repliedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ email: 1 });
contactMessageSchema.index({ messageType: 1 });

// Virtual for full name display
contactMessageSchema.virtual('displayName').get(function() {
  return this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
});

// Method to mark as read
contactMessageSchema.methods.markAsRead = function() {
  this.status = 'read';
  return this.save();
};

// Method to mark as replied
contactMessageSchema.methods.markAsReplied = function() {
  this.status = 'replied';
  this.repliedAt = new Date();
  return this.save();
};

// Static method to get unread count
contactMessageSchema.statics.getUnreadCount = function() {
  return this.countDocuments({ status: 'new' });
};

// Static method to get recent messages
contactMessageSchema.statics.getRecentMessages = function(limit = 10) {
  return this.find().sort({ createdAt: -1 }).limit(limit);
};

module.exports = mongoose.model('ContactMessage', contactMessageSchema);