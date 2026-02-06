import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check,
  Star,
  Zap,
  Crown,
  Award,
  Users,
  Calendar,
  Clock,
  Target,
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Membership = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: Target,
      tagline: 'Perfect for beginners',
      monthlyPrice: 1500,
      yearlyPrice: 15000,
      originalMonthlyPrice: 2000,
      originalYearlyPrice: 20000,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      popular: false,
      features: [
        'Access to gym equipment',
        'Basic workout plans',
        'Locker facility',
        'Free WiFi',
        'Water station access',
        'Basic fitness assessment'
      ],
      notIncluded: [
        'Personal training',
        'Group classes',
        'Nutrition consultation',
        'Sauna access'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Star,
      tagline: 'Most popular choice',
      monthlyPrice: 2500,
      yearlyPrice: 25000,
      originalMonthlyPrice: 3500,
      originalYearlyPrice: 35000,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      popular: true,
      features: [
        'Everything in Basic',
        'Group fitness classes',
        '2 personal training sessions/month',
        'Nutrition consultation',
        'Premium locker',
        'Guest passes (2/month)',
        'Diet planning support',
        'Progress tracking app'
      ],
      notIncluded: [
        'Unlimited personal training',
        'VIP lounge access'
      ]
    },
    {
      id: 'elite',
      name: 'Elite',
      icon: Crown,
      tagline: 'Ultimate fitness experience',
      monthlyPrice: 4000,
      yearlyPrice: 40000,
      originalMonthlyPrice: 5500,
      originalYearlyPrice: 55000,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      popular: false,
      features: [
        'Everything in Premium',
        'Unlimited personal training',
        'VIP lounge access',
        'Sauna & steam room',
        'Massage therapy (2/month)',
        'Priority class booking',
        'Complimentary supplements',
        'Personalized meal plans',
        'Guest passes (5/month)',
        '24/7 gym access'
      ],
      notIncluded: []
    }
  ];

  const additionalFeatures = [
    {
      icon: Users,
      title: 'Expert Trainers',
      description: 'Certified professionals to guide your journey'
    },
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description: 'Book classes and sessions at your convenience'
    },
    {
      icon: Heart,
      title: 'Health Tracking',
      description: 'Monitor your progress with advanced tools'
    },
    {
      icon: Award,
      title: 'Achievement System',
      description: 'Earn rewards for reaching your fitness goals'
    }
  ];

  const getPriceForCycle = (plan, cycle) => {
    return cycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.yearlyPrice / 12);
  };

  const getOriginalPriceForCycle = (plan, cycle) => {
    return cycle === 'monthly' ? plan.originalMonthlyPrice : Math.floor(plan.originalYearlyPrice / 12);
  };

  const getSavingsPercentage = (plan, cycle) => {
    const currentPrice = cycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    const originalPrice = cycle === 'monthly' ? plan.originalMonthlyPrice : plan.originalYearlyPrice;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton height={60} width={400} className="mx-auto mb-4" />
            <Skeleton height={24} width={600} className="mx-auto mb-8" />
            <Skeleton height={50} width={300} className="mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-8">
                <Skeleton height={40} width={120} className="mb-4" />
                <Skeleton height={60} width={100} className="mb-6" />
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <Skeleton key={j} height={20} />
                  ))}
                </div>
                <Skeleton height={50} className="mt-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
              Choose Your Plan
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            Transform your fitness journey with our flexible membership plans. 
            Each plan is designed to support your unique goals and lifestyle.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-flex bg-white p-2 rounded-2xl shadow-lg border border-gray-200"
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                billingCycle === 'yearly'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const isSelected = selectedPlan === plan.id;
            const currentPrice = getPriceForCycle(plan, billingCycle);
            const originalPrice = getOriginalPriceForCycle(plan, billingCycle);
            const savings = getSavingsPercentage(plan, billingCycle);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                  plan.popular
                    ? 'border-red-500 shadow-red-500/20'
                    : isSelected
                    ? 'border-red-300 shadow-red-300/20'
                    : 'border-gray-200 hover:border-red-300 hover:shadow-lg'
                } ${plan.id === 'elite' ? 'md:scale-105' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                      <Sparkles className="w-4 h-4" />
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Elite Badge */}
                {plan.id === 'elite' && (
                  <div className="absolute top-4 right-4">
                    <Crown className="w-8 h-8 text-purple-500" />
                  </div>
                )}

                {/* Card Content */}
                <div className="p-8 pt-12">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
                      <plan.icon className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm">{plan.tagline}</p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold text-gray-800">₹{currentPrice.toLocaleString()}</span>
                      <span className="text-gray-500">/{billingCycle === 'monthly' ? 'month' : 'month'}</span>
                    </div>
                    
                    {savings > 0 && (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-gray-400 line-through text-sm">₹{originalPrice.toLocaleString()}</span>
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-bold">
                          {savings}% OFF
                        </span>
                      </div>
                    )}
                    
                    {billingCycle === 'yearly' && (
                      <p className="text-sm text-gray-600 mt-2">
                        Billed annually: ₹{(billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice * 12).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + index * 0.2 + featureIndex * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                    
                    {plan.notIncluded.map((feature, featureIndex) => (
                      <motion.div
                        key={`not-${featureIndex}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 + index * 0.2 + featureIndex * 0.1 }}
                        className="flex items-center gap-3 opacity-50"
                      >
                        <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-400 text-xs">×</span>
                        </div>
                        <span className="text-gray-400 text-sm line-through">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <span>Choose {plan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl p-12 mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every membership includes these premium features designed to accelerate your fitness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-20 translate-y-20"></div>
          
          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Ready to Transform Your Life?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-red-100 mb-8 max-w-2xl mx-auto"
            >
              Join thousands of satisfied members who have already transformed their lives. 
              Your fitness journey starts with a single decision.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-red-600 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Start Free Trial</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white rounded-2xl font-bold hover:bg-white hover:text-red-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Clock className="w-5 h-5" />
                <span>Schedule Tour</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Membership;
