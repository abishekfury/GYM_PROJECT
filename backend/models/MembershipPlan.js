const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
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
  duration: {
    value: {
      type: Number,
      required: true,
      min: 1
    },
    unit: {
      type: String,
      required: true,
      enum: ['day', 'week', 'month', 'year']
    }
  },
  features: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    included: {
      type: Boolean,
      default: true
    }
  }],
  limits: {
    gymAccess: {
      type: String,
      enum: ['basic', 'full', 'premium', 'unlimited'],
      default: 'basic'
    },
    personalTrainingSessions: {
      type: Number,
      default: 0
    },
    groupClassesPerMonth: {
      type: Number,
      default: 0
    },
    guestPasses: {
      type: Number,
      default: 0
    }
  },
  stripeProductId: {
    type: String,
    default: null
  },
  stripePriceId: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'corporate'],
    default: 'standard'
  },
  colors: {
    primary: {
      type: String,
      default: '#dc2626'
    },
    gradient: {
      type: String,
      default: 'from-red-500 to-red-600'
    }
  },
  validityPeriod: {
    type: Number,
    default: 30 // days
  },
  cancellationPolicy: {
    type: String,
    default: 'Can be cancelled anytime with 30 days notice'
  },
  tags: [String],
  metadata: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
membershipPlanSchema.index({ isActive: 1, displayOrder: 1 });
membershipPlanSchema.index({ category: 1, price: 1 });
membershipPlanSchema.index({ stripeProductId: 1 });

// Virtual for formatted price
membershipPlanSchema.virtual('formattedPrice').get(function() {
  const symbol = this.currency === 'INR' ? '₹' : this.currency === 'USD' ? '$' : '€';
  return `${symbol}${this.price.toLocaleString()}`;
});

// Virtual for duration text
membershipPlanSchema.virtual('durationText').get(function() {
  const { value, unit } = this.duration;
  const unitText = value === 1 ? unit : `${unit}s`;
  return `${value} ${unitText}`;
});

// Method to check if plan is suitable for user
membershipPlanSchema.methods.isSuitableFor = function(userRequirements = {}) {
  const { fitnessGoal, experience, preferredServices = [] } = userRequirements;
  
  // Basic suitability logic
  if (this.category === 'basic' && experience === 'Advanced (3+ years)') {
    return false;
  }
  
  if (this.category === 'premium' && experience === 'Complete Beginner') {
    return true; // Premium is always good for beginners
  }
  
  return true;
};

// Static method to get active plans
membershipPlanSchema.statics.getActivePlans = function() {
  return this.find({ isActive: true }).sort({ displayOrder: 1, price: 1 });
};

// Static method to get plans by category
membershipPlanSchema.statics.getPlansByCategory = function(category) {
  return this.find({ 
    isActive: true, 
    category: category 
  }).sort({ displayOrder: 1, price: 1 });
};

// Static method to get recommended plans
membershipPlanSchema.statics.getRecommendedPlans = function(userProfile = {}) {
  const query = { isActive: true };
  
  // Add recommendation logic based on user profile
  if (userProfile.experience === 'Complete Beginner') {
    query.category = { $in: ['basic', 'standard'] };
  } else if (userProfile.experience === 'Advanced (3+ years)') {
    query.category = { $in: ['premium', 'standard'] };
  }
  
  return this.find(query).sort({ isPopular: -1, displayOrder: 1 });
};

// Pre-save middleware to ensure only one popular plan per category
membershipPlanSchema.pre('save', async function(next) {
  if (this.isPopular && this.isModified('isPopular')) {
    await this.constructor.updateMany(
      { 
        category: this.category, 
        _id: { $ne: this._id },
        isPopular: true 
      },
      { isPopular: false }
    );
  }
  next();
});

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);