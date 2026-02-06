import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  CreditCard,
  Check,
  X,
  Sparkles,
  Activity,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { membersAPI } from '../services/api';

const MemberRegistration = () => {
  const [formData, setFormData] = useState({
    memberCode: '',
    name: '',
    phone: '',
    email: '',
    membershipPlan: '',
    planAmount: '',
    paidAmount: '',
    paymentMethod: '',
    address: '',
    emergencyContact: {
      name: '',
      phone: ''
    }
  });

  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  const membershipPlans = [
    { 
      value: 'Monthly', 
      label: 'Monthly Plan', 
      duration: '1 Month',
      amount: 1500,
      color: 'from-blue-500 to-blue-600',
      popular: false
    },
    { 
      value: 'Quarterly', 
      label: 'Quarterly Plan', 
      duration: '3 Months',
      amount: 4000,
      color: 'from-green-500 to-green-600',
      popular: false
    },
    { 
      value: '6 Months', 
      label: '6 Month Plan', 
      duration: '6 Months',
      amount: 7500,
      color: 'from-purple-500 to-purple-600',
      popular: true
    },
    { 
      value: 'Yearly', 
      label: 'Yearly Plan', 
      duration: '12 Months',
      amount: 14000,
      color: 'from-red-500 to-red-600',
      popular: false
    }
  ];

  const paymentMethods = [
    { value: 'Cash', icon: '💵', label: 'Cash' },
    { value: 'GPay', icon: '📱', label: 'Google Pay' },
    { value: 'PhonePe', icon: '💜', label: 'PhonePe' },
    { value: 'Paytm', icon: '💙', label: 'Paytm' },
    { value: 'Bank Transfer', icon: '🏦', label: 'Bank Transfer' }
  ];

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Membership Plan', icon: Calendar },
    { id: 3, title: 'Payment Details', icon: CreditCard },
    { id: 4, title: 'Confirmation', icon: CheckCircle2 }
  ];

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const validateField = (name, value) => {
    const errors = { ...validationErrors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Name is required';
        } else if (value.length < 2) {
          errors.name = 'Name must be at least 2 characters';
        } else {
          delete errors.name;
        }
        break;

      case 'phone':
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!value) {
          errors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(value)) {
          errors.phone = 'Enter a valid 10-digit phone number';
        } else {
          delete errors.phone;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          errors.email = 'Enter a valid email address';
        } else {
          delete errors.email;
        }
        break;

      case 'paidAmount':
        const planAmount = parseFloat(formData.planAmount) || 0;
        const paid = parseFloat(value) || 0;
        if (paid < 0) {
          errors.paidAmount = 'Amount cannot be negative';
        } else if (paid > planAmount) {
          errors.paidAmount = 'Cannot exceed plan amount';
        } else {
          delete errors.paidAmount;
        }
        break;

      default:
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Validate field on change
      validateField(name, value);
    }

    // Auto-fill plan amount when membership plan is selected
    if (name === 'membershipPlan') {
      const selectedPlan = membershipPlans.find(plan => plan.value === value);
      if (selectedPlan) {
        setFormData(prev => ({
          ...prev,
          planAmount: selectedPlan.amount
        }));
      }
    }
  };

  const generateMemberCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `GYM${timestamp}${randomNum}`;
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate member code if not provided
      const finalFormData = { ...formData };
      if (!finalFormData.memberCode) {
        finalFormData.memberCode = generateMemberCode();
      }

      const response = await membersAPI.create(finalFormData);
      
      setAlert({
        show: true,
        type: 'success',
        message: `Member registered successfully! Member Code: ${response.memberCode}`
      });

      // Reset form
      setFormData({
        memberCode: '',
        name: '',
        phone: '',
        email: '',
        membershipPlan: '',
        planAmount: '',
        paidAmount: '',
        paymentMethod: '',
        address: '',
        emergencyContact: {
          name: '',
          phone: ''
        }
      });
      setCurrentStep(1);

    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.message || 'Failed to register member'
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton height={40} width={300} className="mb-4" />
            <Skeleton height={20} width={200} />
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <Skeleton height={60} className="mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton height={20} width={120} />
                  <Skeleton height={50} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Member Code */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Member Code (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="memberCode"
                    value={formData.memberCode}
                    onChange={handleChange}
                    placeholder="Auto-generated if empty"
                    className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 outline-none"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 transition-all duration-300 outline-none ${
                      validationErrors.name 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                    placeholder="Enter full name"
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 transition-all duration-300 outline-none ${
                      validationErrors.phone 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                    placeholder="Enter 10-digit phone number"
                  />
                </div>
                {validationErrors.phone && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {validationErrors.phone}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 transition-all duration-300 outline-none ${
                      validationErrors.email 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-200 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 outline-none resize-none"
                    placeholder="Enter full address"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 outline-none"
                  placeholder="Emergency contact name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  name="emergencyContact.phone"
                  value={formData.emergencyContact.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 outline-none"
                  placeholder="Emergency contact phone"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Membership Plan</h3>
              <p className="text-gray-600">Select the plan that best fits your fitness journey</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {membershipPlans.map((plan) => (
                <motion.div
                  key={plan.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChange({ target: { name: 'membershipPlan', value: plan.value } })}
                  className={`relative cursor-pointer border-2 rounded-2xl p-6 transition-all duration-300 ${
                    formData.membershipPlan === plan.value
                      ? 'border-red-500 bg-red-50 shadow-lg'
                      : 'border-gray-200 hover:border-red-300 hover:shadow-md'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        POPULAR
                      </span>
                    </div>
                  )}

                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Calendar className="w-8 h-8 text-white" />
                  </div>

                  <h4 className="text-xl font-bold text-gray-800 mb-2">{plan.label}</h4>
                  <p className="text-gray-600 mb-4">{plan.duration}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-gray-800">₹{plan.amount}</span>
                      <span className="text-gray-500 ml-2">/{plan.duration}</span>
                    </div>
                    
                    {formData.membershipPlan === plan.value && (
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Payment Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-semibold">{formData.membershipPlan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">₹{formData.planAmount}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Paid Amount */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Paid Amount *
                </label>
                <input
                  type="number"
                  name="paidAmount"
                  value={formData.paidAmount}
                  onChange={handleChange}
                  min="0"
                  max={formData.planAmount}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all duration-300 outline-none ${
                    validationErrors.paidAmount 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 focus:border-red-500 focus:ring-red-500/20'
                  }`}
                  placeholder="Enter paid amount"
                />
                {validationErrors.paidAmount && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {validationErrors.paidAmount}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 outline-none"
                >
                  <option value="">Select payment method</option>
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.icon} {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Remaining Balance */}
            {formData.planAmount && formData.paidAmount && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-800 font-semibold">Remaining Balance:</span>
                  <span className="text-yellow-900 font-bold text-lg">
                    ₹{Math.max(0, formData.planAmount - formData.paidAmount)}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Review & Confirm</h3>
              <p className="text-gray-600">Please review all details before submission</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <p className="font-semibold">{formData.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Phone:</span>
                  <p className="font-semibold">{formData.phone}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-semibold">{formData.email || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Membership Plan:</span>
                  <p className="font-semibold">{formData.membershipPlan}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Plan Amount:</span>
                  <p className="font-semibold">₹{formData.planAmount}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Paid Amount:</span>
                  <p className="font-semibold">₹{formData.paidAmount}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <p className="font-semibold">{formData.paymentMethod}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Remaining Balance:</span>
                  <p className="font-semibold text-yellow-600">₹{formData.planAmount - formData.paidAmount}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">New Member Registration</h1>
              <p className="text-gray-600">Add a new member to your gym</p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentStep >= step.id 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-500'
                }`}>
                  <step.icon className="w-5 h-5" />
                  <span className="font-medium hidden md:inline">{step.title}</span>
                  <span className="font-medium md:hidden">{step.id}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-red-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alert Messages */}
        <AnimatePresence>
          {alert.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-xl border ${
                alert.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {alert.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  <span>{alert.message}</span>
                </div>
                <button
                  onClick={() => setAlert({ show: false, type: '', message: '' })}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <motion.button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                whileHover={{ scale: currentStep === 1 ? 1 : 1.02 }}
                whileTap={{ scale: currentStep === 1 ? 1 : 0.98 }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </motion.button>

              {currentStep < 4 ? (
                <motion.button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && (!formData.name || !formData.phone || Object.keys(validationErrors).length > 0)) ||
                    (currentStep === 2 && !formData.membershipPlan) ||
                    (currentStep === 3 && (!formData.paidAmount || !formData.paymentMethod))
                  }
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Activity className="w-5 h-5" />
                      </motion.div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Register Member
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default MemberRegistration;