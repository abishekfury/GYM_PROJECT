const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Customer Information
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      default: null
    }
  },

  // Payment Details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  
  // Membership Information
  membershipPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MembershipPlan',
    required: true
  },
  membershipStartDate: {
    type: Date,
    default: Date.now
  },
  membershipEndDate: {
    type: Date,
    required: true
  },

  // Razorpay Information
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String,
    unique: true,
    sparse: true
  },
  razorpaySignature: {
    type: String
  },

  // Payment Status
  status: {
    type: String,
    enum: [
      'created',           // Order created but payment not attempted
      'attempted',         // Payment attempt initiated
      'paid',             // Payment successful
      'failed',           // Payment failed
      'cancelled',        // Payment cancelled by user
      'refunded',         // Payment refunded
      'partially_refunded' // Partial refund
    ],
    default: 'created'
  },

  // Payment Method
  paymentMethod: {
    type: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'emi', 'bank_transfer'],
      default: 'card'
    },
    last4: {
      type: String,
      default: null
    },
    brand: {
      type: String,
      default: null
    },
    details: {
      type: Map,
      of: String,
      default: {}
    }
  },

  // Transaction Details
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  receipt: {
    url: {
      type: String,
      default: null
    },
    number: {
      type: String,
      default: null
    }
  },

  // Financial Information
  taxes: {
    amount: {
      type: Number,
      default: 0
    },
    rate: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'GST'
    }
  },
  
  discount: {
    amount: {
      type: Number,
      default: 0
    },
    code: {
      type: String,
      default: null
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'fixed'
    }
  },

  totalAmount: {
    type: Number,
    required: true
  },

  // Refund Information
  refunds: [{
    amount: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    stripeRefundId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed'],
      default: 'pending'
    },
    processedAt: {
      type: Date,
      default: Date.now
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null
    }
  }],

  // Billing Address
  billingAddress: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: {
      type: String,
      default: 'IN'
    }
  },

  // Metadata
  metadata: {
    source: {
      type: String,
      enum: ['website', 'mobile_app', 'admin_panel', 'pos'],
      default: 'website'
    },
    userAgent: String,
    ipAddress: String,
    referrer: String
  },

  // Administrative
  notes: {
    type: String,
    default: ''
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  
  // Timestamps
  paidAt: {
    type: Date,
    default: null
  },
  failedAt: {
    type: Date,
    default: null
  },
  refundedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ 'customer.email': 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ membershipPlan: 1 });
paymentSchema.index({ 'customer.memberId': 1 });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  const symbol = this.currency === 'INR' ? '₹' : this.currency === 'USD' ? '$' : '€';
  return `${symbol}${this.totalAmount.toLocaleString()}`;
});

// Virtual for payment summary
paymentSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    amount: this.formattedAmount,
    customer: this.customer.name,
    plan: this.membershipPlan?.name || 'Unknown Plan',
    status: this.status,
    date: this.createdAt
  };
});

// Method to calculate membership end date
paymentSchema.methods.calculateMembershipEndDate = function(plan) {
  const startDate = this.membershipStartDate || new Date();
  const endDate = new Date(startDate);
  
  switch (plan.duration.unit) {
    case 'day':
      endDate.setDate(endDate.getDate() + plan.duration.value);
      break;
    case 'week':
      endDate.setDate(endDate.getDate() + (plan.duration.value * 7));
      break;
    case 'month':
      endDate.setMonth(endDate.getMonth() + plan.duration.value);
      break;
    case 'year':
      endDate.setFullYear(endDate.getFullYear() + plan.duration.value);
      break;
  }
  
  this.membershipEndDate = endDate;
  return endDate;
};

// Method to mark payment as successful
paymentSchema.methods.markAsPaid = function(razorpayPaymentId, signature) {
  this.status = 'paid';
  this.razorpayPaymentId = razorpayPaymentId;
  this.razorpaySignature = signature;
  this.paidAt = new Date();
  return this.save();
};

// Method to mark payment as failed
paymentSchema.methods.markAsFailed = function() {
  this.status = 'failed';
  this.failedAt = new Date();
  return this.save();
};

// Method to process refund
paymentSchema.methods.addRefund = function(refundData) {
  this.refunds.push(refundData);
  
  const totalRefunded = this.refunds
    .filter(refund => refund.status === 'succeeded')
    .reduce((sum, refund) => sum + refund.amount, 0);
  
  if (totalRefunded >= this.totalAmount) {
    this.status = 'refunded';
    this.refundedAt = new Date();
  } else if (totalRefunded > 0) {
    this.status = 'partially_refunded';
  }
  
  return this.save();
};

// Static method to create payment order
paymentSchema.statics.createOrder = async function(orderData) {
  const payment = new this(orderData);
  return await payment.save();
};

// Static method to find payment by Razorpay order ID
paymentSchema.statics.findByRazorpayOrderId = async function(orderId) {
  return await this.findOne({ razorpayOrderId: orderId }).populate('membershipPlan');
};

// Static method to find payment by Razorpay payment ID
paymentSchema.statics.findByRazorpayPaymentId = async function(paymentId) {
  return await this.findOne({ razorpayPaymentId: paymentId }).populate('membershipPlan');
};

// Static method to get revenue statistics
paymentSchema.statics.getRevenueStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        status: 'paid',
        paidAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        totalPayments: { $sum: 1 },
        averageAmount: { $avg: '$totalAmount' }
      }
    }
  ]);
};

// Static method to get monthly revenue
paymentSchema.statics.getMonthlyRevenue = function(year) {
  return this.aggregate([
    {
      $match: {
        status: 'paid',
        paidAt: {
          $gte: new Date(year, 0, 1),
          $lt: new Date(year + 1, 0, 1)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$paidAt' },
        revenue: { $sum: '$totalAmount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]);
};

// Pre-save middleware to generate transaction ID
paymentSchema.pre('save', function(next) {
  if (!this.transactionId && this.isNew) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.transactionId = `TXN_${timestamp}_${random}`.toUpperCase();
  }
  next();
});

// Pre-save middleware to calculate total amount
paymentSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('taxes.amount') || this.isModified('discount.amount')) {
    this.totalAmount = this.amount + (this.taxes.amount || 0) - (this.discount.amount || 0);
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);