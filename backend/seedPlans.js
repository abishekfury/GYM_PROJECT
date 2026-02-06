const mongoose = require('mongoose');
const MembershipPlan = require('./models/MembershipPlan');
require('dotenv').config();

async function seedMembershipPlans() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing plans
    await MembershipPlan.deleteMany({});
    console.log('Cleared existing membership plans');

    // Create new plans
    const plans = [
      {
        name: 'Basic Monthly',
        description: 'Perfect for beginners to start their fitness journey',
        price: 1500,
        currency: 'INR',
        duration: {
          value: 1,
          unit: 'month'
        },
        features: [
          {
            name: 'Gym Access during standard hours',
            description: 'Access to gym during regular operating hours',
            included: true
          },
          {
            name: 'Basic Equipment Access',
            description: 'Access to basic gym equipment',
            included: true
          },
          {
            name: 'Locker Facility',
            description: 'Personal locker for storing belongings',
            included: true
          },
          {
            name: 'Free Initial Assessment',
            description: 'One-time fitness assessment by our trainers',
            included: true
          }
        ],
        isActive: true,
        isPopular: false,
        allowedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        maxMembers: 100,
        trialPeriod: {
          enabled: true,
          days: 3
        }
      },
      {
        name: 'Premium Monthly',
        description: 'Most popular choice for serious fitness enthusiasts',
        price: 2500,
        currency: 'INR',
        duration: {
          value: 1,
          unit: 'month'
        },
        features: [
          {
            name: 'Full Gym Access (6 AM - 11 PM)',
            description: 'Extended hours access to all gym facilities',
            included: true
          },
          {
            name: 'Personal Trainer (2 sessions)',
            description: 'Two personal training sessions per month',
            included: true
          },
          {
            name: 'Nutrition Guidance',
            description: 'Basic nutrition consultation and meal planning',
            included: true
          },
          {
            name: 'Group Classes Access',
            description: 'Unlimited access to all group fitness classes',
            included: true
          },
          {
            name: 'Priority Booking',
            description: 'Priority booking for classes and equipment',
            included: true
          },
          {
            name: 'Guest Pass (2 per month)',
            description: 'Bring guests to the gym twice per month',
            included: true
          }
        ],
        isActive: true,
        isPopular: true,
        allowedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        maxMembers: 200,
        trialPeriod: {
          enabled: true,
          days: 7
        }
      },
      {
        name: 'Elite Monthly',
        description: 'Ultimate fitness package with premium benefits',
        price: 4000,
        currency: 'INR',
        duration: {
          value: 1,
          unit: 'month'
        },
        features: [
          {
            name: 'Unlimited 24/7 Access',
            description: 'Round-the-clock access to all facilities',
            included: true
          },
          {
            name: 'Personal Trainer (8 sessions)',
            description: 'Eight personal training sessions per month',
            included: true
          },
          {
            name: 'Custom Meal Planning',
            description: 'Personalized nutrition plan and diet consultation',
            included: true
          },
          {
            name: 'All Group Classes',
            description: 'Access to all group classes including premium ones',
            included: true
          },
          {
            name: 'Priority Equipment Access',
            description: 'Priority access to all gym equipment',
            included: true
          },
          {
            name: 'Massage Therapy (2 sessions)',
            description: 'Two massage therapy sessions per month',
            included: true
          },
          {
            name: 'Guest Pass (Unlimited)',
            description: 'Unlimited guest passes for friends and family',
            included: true
          },
          {
            name: 'Free Supplements',
            description: 'Monthly supplement package included',
            included: true
          }
        ],
        isActive: true,
        isPopular: false,
        allowedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        maxMembers: 50,
        trialPeriod: {
          enabled: true,
          days: 14
        }
      }
    ];

    const createdPlans = await MembershipPlan.insertMany(plans);
    console.log('Created membership plans:', createdPlans.map(p => ({ id: p._id, name: p.name })));

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');

    return createdPlans;

  } catch (error) {
    console.error('Error seeding membership plans:', error);
    process.exit(1);
  }
}

// Run the seeding function
if (require.main === module) {
  seedMembershipPlans();
}

module.exports = seedMembershipPlans;