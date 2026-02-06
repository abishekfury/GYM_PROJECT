const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const MembershipPlan = require('../models/MembershipPlan');
const Member = require('../models/Member');
const rateLimit = require('express-rate-limit');

// Initialize Razorpay
let razorpay;
try {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!keyId || !keySecret || keySecret.trim() === '') {
    throw new Error('Missing or empty Razorpay credentials');
  }
  
  razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
  console.log('✅ Razorpay initialized successfully');
} catch (error) {
  console.warn('⚠️ Razorpay initialization failed. Running in mock mode:', error.message);
  razorpay = null;
}

// Rate limiting for payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many payment attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all payment routes
router.use(paymentLimiter);

// Discount codes configuration
const DISCOUNT_CODES = {
  'WELCOME20': { type: 'percentage', value: 20, description: '20% off for new members' },
  'STUDENT15': { type: 'percentage', value: 15, description: '15% off for students' },
  'NEWYEAR25': { type: 'percentage', value: 25, description: 'New Year special - 25% off' },
  'FITNESS50': { type: 'fixed', value: 500, description: 'Flat ₹500 off' },
  'PREMIUM10': { type: 'percentage', value: 10, description: '10% off on premium plans' }
};

// Calculate discount amount
const calculateDiscount = (planPrice, discountCode) => {
  const discount = DISCOUNT_CODES[discountCode?.toUpperCase()];
  if (!discount) return 0;
  
  if (discount.type === 'percentage') {
    return Math.floor((planPrice * discount.value) / 100);
  } else {
    return Math.min(discount.value, planPrice);
  }
};

// Calculate GST (18% for services in India)
const calculateGST = (amount) => {
  return Math.floor((amount * 18) / 100);
};

// POST /api/payments/create-order - Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const {
      planId,
      customerInfo,
      billingAddress,
      discountCode,
      membershipStartDate
    } = req.body;

    // Validate required fields
    if (!planId || !customerInfo?.name || !customerInfo?.email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: planId, customer name, and email'
      });
    }

    // Get membership plan
    const plan = await MembershipPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found'
      });
    }

    // Calculate pricing
    const planPrice = plan.price;
    const discountAmount = calculateDiscount(planPrice, discountCode);
    const discountedPrice = planPrice - discountAmount;
    const gstAmount = calculateGST(discountedPrice);
    const totalAmount = discountedPrice + gstAmount;

    // Calculate membership dates
    const startDate = new Date(membershipStartDate || Date.now());
    const endDate = new Date(startDate);
    
    // Calculate end date based on plan duration
    let durationInDays = 30; // Default
    if (plan.duration) {
      switch (plan.duration.unit) {
        case 'day':
          durationInDays = plan.duration.value;
          break;
        case 'week':
          durationInDays = plan.duration.value * 7;
          break;
        case 'month':
          durationInDays = plan.duration.value * 30;
          break;
        case 'year':
          durationInDays = plan.duration.value * 365;
          break;
      }
    }
    endDate.setDate(endDate.getDate() + durationInDays);

    // Create Razorpay order
    const orderOptions = {
      amount: totalAmount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `GYM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      notes: {
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        membership_plan: plan.name,
        discount_code: discountCode || 'None'
      }
    };

    // Check if running in mock mode
    if (!razorpay) {
      // Return mock order for development
      const mockOrderId = `order_mock_${Date.now()}`;
      
      console.log('📝 Mock Razorpay order created:', {
        id: mockOrderId,
        amount: totalAmount * 100,
        currency: 'INR'
      });

      // Create payment record with mock order ID
      const payment = await Payment.create({
        razorpayOrderId: mockOrderId,
        membershipPlan: planId,
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone || ''
        },
        billingAddress: {
          line1: billingAddress?.street || '',
          city: billingAddress?.city || '',
          state: billingAddress?.state || '',
          postalCode: billingAddress?.pincode || '',
          country: 'India'
        },
        amount: planPrice,
        totalAmount: totalAmount,
        taxes: {
          amount: gstAmount,
          rate: 18,
          type: 'GST'
        },
        discount: {
          amount: discountAmount,
          code: discountCode || null,
          type: 'percentage'
        },
        membershipStartDate: startDate,
        membershipEndDate: endDate,
        status: 'created',
        receipt: {
          number: `INV-${Date.now()}`
        }
      });

      return res.json({
        success: true,
        orderId: mockOrderId,
        amount: totalAmount * 100,
        currency: 'INR',
        keyId: 'rzp_test_mock',
        paymentId: payment._id,
        mockMode: true,
        billing: {
          planPrice,
          discountAmount,
          gstAmount,
          totalAmount,
          discountCode: discountCode || null
        }
      });
    }

    // Create actual Razorpay order
    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Create payment record for real payment
    const payment = await Payment.create({
      razorpayOrderId: razorpayOrder.id,
      membershipPlan: planId,
      customer: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone || ''
      },
      billingAddress: {
        line1: billingAddress?.street || '',
        city: billingAddress?.city || '',
        state: billingAddress?.state || '',
        postalCode: billingAddress?.pincode || '',
        country: 'India'
      },
      amount: planPrice,
      totalAmount: totalAmount,
      taxes: {
        amount: gstAmount,
        rate: 18,
        type: 'GST'
      },
      discount: {
        amount: discountAmount,
        code: discountCode || null,
        type: 'percentage'
      },
      membershipStartDate: startDate,
      membershipEndDate: endDate,
      status: 'created',
      receipt: {
        number: `INV-${Date.now()}`
      }
    });

    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id,
      billing: {
        planPrice,
        discountAmount,
        gstAmount,
        totalAmount,
        discountCode: discountCode || null
      }
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/payments/verify-payment - Verify Razorpay payment
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentId
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification data'
      });
    }

    // Check if in mock mode
    const isMockOrder = razorpayOrderId.startsWith('order_mock_');
    let isAuthentic = true;

    if (!isMockOrder && razorpay) {
      // Verify signature for real payments
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      isAuthentic = expectedSignature === razorpaySignature;
    } else if (isMockOrder) {
      // Mock mode - accept payment without signature verification
      console.log('📝 Mock payment verification for order:', razorpayOrderId);
      isAuthentic = true;
    }

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed'
      });
    }

    // Find payment record
    const payment = await Payment.findByRazorpayOrderId(razorpayOrderId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Get payment details from Razorpay
    const razorpayPayment = await razorpay.payments.fetch(razorpayPaymentId);

    // Update payment record
    await payment.markAsPaid(
      razorpayPaymentId,
      razorpaySignature,
      razorpayPayment.method
    );

    // Create or update member record
    let member = await Member.findOne({ email: payment.customer.email });
    if (!member) {
      member = new Member({
        name: payment.customer.name,
        email: payment.customer.email,
        phone: payment.customer.phone,
        membershipPlan: payment.membershipPlan,
        membershipStartDate: payment.membershipStartDate,
        membershipEndDate: payment.membershipEndDate,
        membershipStatus: 'active',
        payments: [payment._id]
      });
    } else {
      member.membershipPlan = payment.membershipPlan;
      member.membershipStartDate = payment.membershipStartDate;
      member.membershipEndDate = payment.membershipEndDate;
      member.membershipStatus = 'active';
      member.payments.push(payment._id);
    }
    await member.save();

    // Update payment with member reference
    payment.customer.memberId = member._id;
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        payment: {
          id: payment._id,
          status: payment.status,
          amount: payment.formattedAmount,
          transactionId: razorpayPaymentId
        },
        member: {
          id: member._id,
          name: member.name,
          email: member.email,
          membershipStatus: member.membershipStatus,
          membershipEndDate: member.membershipEndDate
        }
      }
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/payments/plans - Get all membership plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true }).sort({ price: 1 });
    
    res.status(200).json({
      success: true,
      data: plans
    });

  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch membership plans'
    });
  }
});

// GET /api/payments/discount/:code - Validate discount code
router.get('/discount/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const discount = DISCOUNT_CODES[code.toUpperCase()];
    
    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Invalid discount code'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        code: code.toUpperCase(),
        ...discount
      }
    });

  } catch (error) {
    console.error('Error validating discount code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate discount code'
    });
  }
});

module.exports = router;