import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Shield,
  Calendar,
  Users,
  Star,
  X,
  Loader,
  IndianRupee,
  Smartphone,
  CreditCard as CardIcon,
  Wallet,
  Building2
} from 'lucide-react';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  membershipPlan, 
  customerInfo,
  onPaymentSuccess 
}) => {
  const [step, setStep] = useState(1); // 1: Plan Review, 2: Billing, 3: Payment
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  
  const [billingInfo, setBillingInfo] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'IN'
  });

  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(null);
  const [orderData, setOrderData] = useState(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError(null);
      setDiscountCode('');
      setDiscountApplied(null);
      setOrderData(null);
      setSucceeded(false);
    }
  }, [isOpen]);

  const createOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: membershipPlan.id,
          customerInfo,
          billingAddress: billingInfo,
          discountCode: discountCode || null,
          membershipStartDate: new Date().toISOString()
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Transform API response to expected format
        const orderData = {
          razorpayOrderId: data.orderId,
          paymentId: data.paymentId,
          amount: data.amount,
          currency: data.currency,
          customer: customerInfo,
          membershipPlan: membershipPlan,
          breakdown: {
            planPrice: data.billing?.planPrice || membershipPlan.price,
            discount: data.billing?.discountAmount || 0,
            taxes: data.billing?.gstAmount || 0,
            total: data.billing?.totalAmount || membershipPlan.price
          },
          formattedAmount: `₹${(data.billing?.totalAmount || membershipPlan.price).toLocaleString('en-IN')}`,
          discountApplied: data.billing?.discountAmount > 0 ? {
            code: data.billing?.discountCode,
            amount: data.billing?.discountAmount,
            description: `${((data.billing?.discountAmount / data.billing?.planPrice) * 100).toFixed(0)}% off`
          } : null
        };
        
        setOrderData(orderData);
        setStep(3);
        
        if (data.billing?.discountAmount > 0) {
          setDiscountApplied({
            code: data.billing?.discountCode,
            amount: data.billing?.discountAmount
          });
        }
      } else {
        setError(data.message || 'Failed to create order');
      }
    } catch (err) {
      console.error('Create order error:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to payment server. Please ensure the backend is running.');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const initiateRazorpayPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if this is mock mode (based on keyId)
      const isMockMode = orderData.mockMode || 
                        (orderData.keyId && orderData.keyId === 'rzp_test_mock');

      if (isMockMode) {
        // Simulate mock payment success
        setTimeout(async () => {
          try {
            const mockResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpayOrderId: orderData.razorpayOrderId,
                razorpayPaymentId: `pay_mock_${Date.now()}`,
                razorpaySignature: `mock_signature_${Date.now()}`,
                paymentId: orderData.paymentId
              }),
            });

            const verifyData = await mockResponse.json();
            if (verifyData.success) {
              setSucceeded(true);
              onPaymentSuccess && onPaymentSuccess(verifyData.data);
              
              // Auto-close modal after 3 seconds
              setTimeout(() => {
                onClose();
              }, 3000);
            } else {
              setError('Mock payment verification failed. Please try again.');
            }
          } catch (error) {
            setError('Mock payment failed. Please try again.');
          } finally {
            setLoading(false);
          }
        }, 2000); // Simulate 2-second processing time
        return;
      }

      // Load Razorpay script for real payments
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway. Please try again.');
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_mock',
        amount: orderData.amount, // Already in paise from API
        currency: orderData.currency || 'INR',
        name: 'Raju Rapse Gym',
        description: `${membershipPlan.name} Membership`,
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                paymentId: orderData.paymentId
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              setSucceeded(true);
              onPaymentSuccess && onPaymentSuccess(verifyData.data);
              
              // Auto-close modal after 3 seconds
              setTimeout(() => {
                onClose();
              }, 3000);
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch (verifyError) {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone || '',
        },
        notes: {
          membership_plan: membershipPlan.name,
          customer_name: customerInfo.name,
        },
        theme: {
          color: '#dc2626', // Red theme matching gym colors
        },
        modal: {
          ondismiss: () => {
            setError('Payment was cancelled.');
            setLoading(false);
          }
        },
        retry: {
          enabled: true,
          max_count: 3
        },
        timeout: 600, // 10 minutes timeout
        remember_customer: false
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      setError(err.message || 'Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateBillingInfo = () => {
    return billingInfo.line1 && billingInfo.city && billingInfo.state && billingInfo.postalCode;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Complete Your Membership</h2>
                <p className="text-red-100">Secure payment with Razorpay</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center space-x-2">
              {[
                { number: 1, label: 'Review' },
                { number: 2, label: 'Billing' },
                { number: 3, label: 'Payment' }
              ].map((stepItem, index) => (
                <React.Fragment key={`step-${stepItem.number}`}>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                    step >= stepItem.number ? 'bg-white/20 text-white' : 'bg-white/10 text-red-200'
                  }`}>
                    <span className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-xs">
                      {stepItem.number}
                    </span>
                    <span>{stepItem.label}</span>
                  </div>
                  {index < 2 && <div key={`divider-${index}`} className="w-8 h-0.5 bg-white/30"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-160px)] overflow-y-auto">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-800">{error}</span>
                </div>
              </motion.div>
            )}

            {/* Success State */}
            {succeeded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">
                  Your membership has been activated. Welcome to Raju Rapse Gym!
                </p>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-green-800 font-medium">
                    Confirmation details have been sent to your email.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 1: Plan Review */}
            {!succeeded && step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Your Selection</h3>
                  <p className="text-gray-600">Confirm your membership plan and customer details</p>
                </div>

                {/* Plan Details */}
                <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-xl font-bold text-gray-900">{membershipPlan.name}</h4>
                        {membershipPlan.popular && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Popular</span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{membershipPlan.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-700">{membershipPlan.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-700">Full Access</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-700">Premium Features</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h5 className="font-semibold text-gray-900">Includes:</h5>
                        <ul className="space-y-1">
                          {membershipPlan.features.map((feature, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <CheckCircle2 className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-red-600">
                        ₹{membershipPlan.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">per month</div>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h5 className="font-semibold text-gray-900 mb-3">Customer Details:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{customerInfo.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium">{customerInfo.email}</span>
                    </div>
                    {customerInfo.phone && (
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2 font-medium">{customerInfo.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Continue to Billing
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Billing Information */}
            {!succeeded && step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Billing Information</h3>
                  <p className="text-gray-600">Enter your billing address and any discount codes</p>
                </div>

                {/* Billing Address */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Billing Address</h4>
                  
                  <div>
                    <input
                      type="text"
                      placeholder="Address Line 1 *"
                      value={billingInfo.line1}
                      onChange={(e) => setBillingInfo(prev => ({ ...prev, line1: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      placeholder="Address Line 2"
                      value={billingInfo.line2}
                      onChange={(e) => setBillingInfo(prev => ({ ...prev, line2: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="City *"
                      value={billingInfo.city}
                      onChange={(e) => setBillingInfo(prev => ({ ...prev, city: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="text"
                      placeholder="State *"
                      value={billingInfo.state}
                      onChange={(e) => setBillingInfo(prev => ({ ...prev, state: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="text"
                      placeholder="PIN Code *"
                      value={billingInfo.postalCode}
                      onChange={(e) => setBillingInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Discount Code */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Discount Code (Optional)</h4>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Available codes: WELCOME20 (20% off), STUDENT15 (15% off), NEWYEAR25 (25% off), FITNESS50 (₹500 off)
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={createOrder}
                    disabled={!validateBillingInfo() || loading}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                      !validateBillingInfo() || loading
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to Payment</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {!succeeded && step === 3 && orderData && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h3>
                  <p className="text-gray-600">Choose your payment method</p>
                  {orderData?.mockMode && (
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                      Test Mode - No real money will be charged
                    </div>
                  )}
                </div>

                {/* Payment Summary */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Plan Price:</span>
                    <span className="font-medium">₹{orderData.breakdown.planPrice.toLocaleString()}</span>
                  </div>
                  {orderData.breakdown.discount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Discount:</span>
                      <span className="font-medium">-₹{orderData.breakdown.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Taxes (18% GST):</span>
                    <span className="font-medium">₹{orderData.breakdown.taxes.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-red-600">{orderData.formattedAmount}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Supported Payment Methods</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                      <CardIcon className="w-8 h-8 text-blue-600 mb-2" />
                      <span className="text-sm text-gray-700">Cards</span>
                    </div>
                    <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                      <Smartphone className="w-8 h-8 text-green-600 mb-2" />
                      <span className="text-sm text-gray-700">UPI/GPay</span>
                    </div>
                    <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                      <Building2 className="w-8 h-8 text-purple-600 mb-2" />
                      <span className="text-sm text-gray-700">Net Banking</span>
                    </div>
                    <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                      <Wallet className="w-8 h-8 text-orange-600 mb-2" />
                      <span className="text-sm text-gray-700">Wallets</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={initiateRazorpayPayment}
                    disabled={loading}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                      loading
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : orderData?.mockMode 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg'
                          : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        <span>
                          {orderData?.mockMode ? 'Test Pay' : 'Pay'} {orderData.formattedAmount}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;