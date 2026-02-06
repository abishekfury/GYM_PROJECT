import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Target,
  X,
  CheckCircle2,
  AlertTriangle,
  Send,
  Dumbbell,
  Clock,
  Users,
  Award,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import PaymentModal from './PaymentModal';

const MembershipInquiryModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    fitnessGoal: '',
    experience: '',
    preferredTime: '',
    membershipType: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);

  // Initialize with fallback plans immediately
  useEffect(() => {
    const fallbackPlans = [
      {
        id: '6953a62fba6a208ecaf317d7',
        name: 'Basic Monthly',
        price: 1500,
        duration: '1 Month',
        description: 'Perfect for beginners to start their fitness journey',
        features: [
          'Gym Access during standard hours',
          'Basic Equipment Access', 
          'Locker Facility',
          'Free Initial Assessment'
        ],
        popular: false
      },
      {
        id: '6953a62fba6a208ecaf317dc',
        name: 'Premium Monthly',
        price: 2500,
        duration: '1 Month',
        description: 'Most popular choice for serious fitness enthusiasts',
        features: [
          'Full Gym Access (6 AM - 11 PM)',
          'Personal Trainer (2 sessions)',
          'Nutrition Guidance',
          'Group Classes Access',
          'Priority Booking',
          'Guest Pass (2 per month)'
        ],
        popular: true
      },
      {
        id: '6953a62fba6a208ecaf317e3',
        name: 'Elite Monthly',
        price: 4000,
        duration: '1 Month',
        description: 'Ultimate fitness package with premium benefits',
        features: [
          'Unlimited 24/7 Access',
          'Personal Trainer (8 sessions)',
          'Custom Meal Planning',
          'All Group Classes',
          'Priority Equipment Access',
          'Massage Therapy (2 sessions)',
          'Guest Pass (Unlimited)',
          'Free Supplements'
        ],
        popular: false
      }
    ];

    // Set fallback plans immediately
    setMembershipPlans(fallbackPlans);
  }, []);

  // Fetch membership plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      if (!isOpen) return;
      
      try {
        setPlansLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/plans`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          // Transform plans for frontend use
          const transformedPlans = data.data.map(plan => {
            return {
              id: plan._id,
              name: plan.name,
              price: plan.price,
              duration: plan.duration ? 
                `${plan.duration.value} ${plan.duration.unit.charAt(0).toUpperCase() + plan.duration.unit.slice(1)}${plan.duration.value > 1 ? 's' : ''}` :
                'Monthly',
              description: plan.description,
              features: Array.isArray(plan.features) ? 
                plan.features
                  .filter(f => f.included !== false) // Include features that are explicitly included or don't have included field
                  .map(f => {
                    const featureName = typeof f === 'string' ? f : f.name;
                    return featureName;
                  }) : 
                ['Access to gym facilities'],
              popular: plan.isPopular || false
            };
          });
          
          // Safety check to ensure all features are strings
          const safeTransformedPlans = transformedPlans.map(plan => ({
            ...plan,
            features: plan.features.map(f => typeof f === 'string' ? f : (f?.name || 'Feature'))
          }));
          
          setMembershipPlans(safeTransformedPlans);
        } else {
        }
      } catch (error) {
        // Keep the fallback plans that were already set
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, [isOpen]);

  const fitnessGoals = [
    'Weight Loss',
    'Muscle Building',
    'General Fitness',
    'Strength Training',
    'Endurance Building',
    'Athletic Performance',
    'Rehabilitation',
    'Flexibility & Mobility'
  ];

  const experienceLevels = [
    'Complete Beginner',
    'Some Experience (< 1 year)',
    'Intermediate (1-3 years)',
    'Advanced (3+ years)',
    'Professional/Competitive'
  ];

  const preferredTimes = [
    'Early Morning (5:00-8:00 AM)',
    'Morning (8:00-12:00 PM)',
    'Afternoon (12:00-5:00 PM)',
    'Evening (5:00-8:00 PM)',
    'Night (8:00-11:00 PM)',
    'Flexible/Any Time'
  ];

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

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          errors.email = 'Enter a valid email address';
        } else {
          delete errors.email;
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

      case 'age':
        const ageNum = parseInt(value);
        if (!value) {
          errors.age = 'Age is required';
        } else if (isNaN(ageNum) || ageNum < 16 || ageNum > 100) {
          errors.age = 'Enter a valid age between 16 and 100';
        } else {
          delete errors.age;
        }
        break;

      case 'fitnessGoal':
      case 'experience':
      case 'preferredTime':
      case 'membershipType':
        if (!value) {
          errors[name] = 'This field is required';
        } else {
          delete errors[name];
        }
        break;

      default:
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    validateField(name, value);

    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate step 1 fields
      const step1Fields = ['name', 'email', 'phone', 'age'];
      const isStep1Valid = step1Fields.every(field => validateField(field, formData[field]));
      
      if (isStep1Valid) {
        setCurrentStep(2);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = ['name', 'email', 'phone', 'age', 'fitnessGoal', 'experience', 'preferredTime', 'membershipType'];
    const isValid = requiredFields.every(field => validateField(field, formData[field]));

    if (!isValid) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Please fill in all required fields correctly' 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'join_now',
          messageType: 'membership',
          subject: `Membership Inquiry - ${formData.membershipType} Plan`,
          message: `
Membership Inquiry Details:
- Selected Plan: ${formData.membershipType}
- Fitness Goal: ${formData.fitnessGoal}
- Experience Level: ${formData.experience}
- Preferred Time: ${formData.preferredTime}
- Age: ${formData.age}
${formData.message ? `- Additional Message: ${formData.message}` : ''}

Please contact me to discuss membership options and schedule a tour.
          `.trim()
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({ 
          type: 'success', 
          message: data.message
        });
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            age: '',
            fitnessGoal: '',
            experience: '',
            preferredTime: '',
            membershipType: '',
            message: ''
          });
          setValidationErrors({});
          setCurrentStep(1);
          setSubmitStatus(null);
          onClose();
        }, 3000);
        
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: data.message || 'Failed to submit inquiry. Please try again.' 
        });
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
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
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
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
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
              >
                <Dumbbell className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold">Join Raju Rapse Gym</h2>
                <p className="text-red-100">Start your fitness journey today!</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                currentStep >= 1 ? 'bg-white/20 text-white' : 'bg-white/10 text-red-200'
              }`}>
                <span className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-xs">1</span>
                <span>Personal Info</span>
              </div>
              <div className="w-8 h-0.5 bg-white/30"></div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                currentStep >= 2 ? 'bg-white/20 text-white' : 'bg-white/10 text-red-200'
              }`}>
                <span className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-xs">2</span>
                <span>Preferences</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Status Message */}
            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl border ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {submitStatus.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">{submitStatus.message}</span>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Let's Get to Know You</h3>
                    <p className="text-gray-600">Tell us about yourself so we can personalize your experience</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {validationErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email address"
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          validationErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter 10-digit phone number"
                      />
                      {validationErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                      )}
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Age *
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        min="16"
                        max="100"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          validationErrors.age ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Enter your age"
                      />
                      {validationErrors.age && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.age}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <motion.button
                      type="button"
                      onClick={handleNext}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Next Step →
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Preferences and Plans */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Path</h3>
                    <p className="text-gray-600">Select your fitness preferences and membership plan</p>
                  </div>

                  {/* Fitness Goal */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Target className="w-4 h-4 inline mr-2" />
                      Primary Fitness Goal *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {fitnessGoals.map((goal) => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => handleInputChange({ target: { name: 'fitnessGoal', value: goal } })}
                          className={`p-3 text-sm rounded-xl border-2 transition-all duration-300 ${
                            formData.fitnessGoal === goal
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                          }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                    {validationErrors.fitnessGoal && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.fitnessGoal}</p>
                    )}
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Award className="w-4 h-4 inline mr-2" />
                      Experience Level *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {experienceLevels.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleInputChange({ target: { name: 'experience', value: level } })}
                          className={`p-3 text-sm rounded-xl border-2 transition-all duration-300 text-left ${
                            formData.experience === level
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    {validationErrors.experience && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.experience}</p>
                    )}
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Preferred Workout Time *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {preferredTimes.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleInputChange({ target: { name: 'preferredTime', value: time } })}
                          className={`p-3 text-sm rounded-xl border-2 transition-all duration-300 text-left ${
                            formData.preferredTime === time
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    {validationErrors.preferredTime && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.preferredTime}</p>
                    )}
                  </div>

                  {/* Membership Plans */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Users className="w-4 h-4 inline mr-2" />
                      Choose Membership Plan *
                    </label>
                    {plansLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-5 rounded-xl border-2 border-gray-200 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded mb-4"></div>
                            <div className="space-y-2">
                              <div className="h-3 bg-gray-200 rounded"></div>
                              <div className="h-3 bg-gray-200 rounded"></div>
                              <div className="h-3 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {membershipPlans.map((plan) => (
                        <motion.div
                          key={plan._id || plan.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-5 rounded-xl border-2 transition-all duration-300 text-left relative ${
                            formData.membershipType === plan.name
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-red-300 hover:shadow-lg'
                          }`}
                        >
                          {plan.popular && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              Popular
                            </div>
                          )}
                          
                          <div className="mb-4">
                            <div className="text-xl font-bold text-gray-900">{plan.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{plan.description}</div>
                            <div className="text-2xl font-bold text-red-600 mt-2">
                              ₹{plan.price.toLocaleString()}<span className="text-sm text-gray-500">/{plan.duration}</span>
                            </div>
                          </div>

                        <ul className="space-y-1 mb-4">
                          {(plan.features || []).map((feature, featureIndex) => {
                            // Ensure feature is always a string
                            const featureText = typeof feature === 'string' ? feature : 
                                              feature?.name || 
                                              (typeof feature === 'object' ? JSON.stringify(feature) : 'Feature');
                            return (
                              <li key={`feature-${plan._id || plan.id}-${featureIndex}`} className="text-sm text-gray-600 flex items-center">
                                <CheckCircle2 className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                                {featureText}
                              </li>
                            );
                          })}
                        </ul>                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={() => handleInputChange({ target: { name: 'membershipType', value: plan.name } })}
                              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                                formData.membershipType === plan.name
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {formData.membershipType === plan.name ? 'Selected' : 'Select Plan'}
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPlan(plan);
                                setPaymentModalOpen(true);
                              }}
                              className="w-full py-2 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                              <CreditCard className="w-4 h-4" />
                              <span>Pay Now</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                      </div>
                    )}
                    {validationErrors.membershipType && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.membershipType}</p>
                    )}
                  </div>

                  {/* Additional Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Any specific questions or requirements?"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-8">
                    <motion.button
                      type="button"
                      onClick={handlePrevious}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all duration-300"
                    >
                      ← Previous
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                      className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2 ${
                        isSubmitting
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-xl'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Submit Inquiry</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </motion.div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedPlan(null);
          }}
          membershipPlan={selectedPlan}
          customerInfo={{
            name: formData.name || 'Guest User',
            email: formData.email || '',
            phone: formData.phone || ''
          }}
          onPaymentSuccess={(paymentData) => {
            // Handle successful payment
            setSubmitStatus('success');
            setCurrentStep(1);
            setPaymentModalOpen(false);
            
            // Reset form after short delay to show success message
            setTimeout(() => {
              setFormData({
                name: '',
                email: '',
                phone: '',
                age: '',
                fitnessGoal: '',
                experience: '',
                preferredTime: '',
                membershipType: '',
                message: ''
              });
              setValidationErrors({});
              setSubmitStatus(null);
              setSelectedPlan(null);
              onClose();
            }, 3000);
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default MembershipInquiryModal;