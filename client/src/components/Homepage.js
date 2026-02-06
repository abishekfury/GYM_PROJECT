import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Dumbbell, 
  Users, 
  Award, 
  Clock, 
  Star, 
  ChevronRight, 
  Play,
  MapPin,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import MembershipInquiryModal from './MembershipInquiryModal';

const ShimmerCard = () => (
  <div className="bg-white rounded-xl p-6 shadow-lg">
    <Skeleton height={60} width={60} circle />
    <Skeleton height={20} className="mt-4" />
    <Skeleton height={40} className="mt-2" />
  </div>
);

const Homepage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, 50]);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Membership modal state
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Form validation
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
        if (value && !phoneRegex.test(value)) {
          errors.phone = 'Enter a valid 10-digit phone number';
        } else {
          delete errors.phone;
        }
        break;

      case 'message':
        if (!value.trim()) {
          errors.message = 'Message is required';
        } else if (value.length < 10) {
          errors.message = 'Message must be at least 10 characters';
        } else {
          delete errors.message;
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

    // Validate field on change
    validateField(name, value);

    // Clear submit status when user starts typing
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = Object.keys(formData).every(key => {
      if (key === 'phone') return true; // Optional field
      return validateField(key, formData[key]);
    });

    if (!isValid) {
      setSubmitStatus({ type: 'error', message: 'Please fix all validation errors' });
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
          source: 'homepage',
          messageType: 'contact',
          subject: 'Homepage Contact Form'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({ 
          type: 'success', 
          message: data.message
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        setValidationErrors({});
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: data.message || 'Failed to send message. Please try again.' 
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
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Navigation Header */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg border-b border-red-100 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex-shrink-0 flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center"
                >
                  <Dumbbell className="w-6 h-6 text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  RAJU RAPSE GYM
                </h1>
              </div>
            </motion.div>
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'About', 'Programs', 'Trainers', 'Contact'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                    className="text-gray-800 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-red-50 relative group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMembershipModalOpen(true)}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Join Now
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-red-900 to-black">
        {/* Animated Background Elements */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-red-800/10 rounded-full blur-3xl"
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              RAJU RAPSE
              <motion.span 
                className="block text-4xl md:text-6xl text-red-400 mt-2"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                FITNESS GYM
              </motion.span>
            </motion.h1>
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="w-32 h-1 bg-gradient-to-r from-red-500 to-red-700 mx-auto mb-8"
            />
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              Transform Your Body, Elevate Your Mind. Experience the Ultimate Fitness Journey with 
              State-of-the-Art Equipment and Expert Guidance.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(220, 38, 38, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMembershipModalOpen(true)}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start Your Journey</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-red-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Watch Story</span>
              </motion.button>
            </motion.div>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            {[
              { number: '10+', label: 'Years Experience' },
              { number: '5000+', label: 'Happy Members' },
              { number: '50+', label: 'Expert Trainers' },
              { number: '24/7', label: 'Open Hours' },
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                whileHover={{ scale: 1.1, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.number}</div>
                <div className="text-red-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="text-center mb-20"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Why Choose 
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent"> Us?</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 mx-auto mb-6"/>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the ultimate fitness destination with cutting-edge facilities, 
              expert guidance, and a community that motivates you to achieve greatness.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <ShimmerCard key={index} />
              ))
            ) : (
              [
                { 
                  icon: Dumbbell, 
                  title: 'Premium Equipment', 
                  description: 'State-of-the-art machines and equipment from leading manufacturers worldwide for optimal performance.',
                  gradient: 'from-red-500 to-red-600'
                },
                { 
                  icon: Users, 
                  title: 'Expert Trainers', 
                  description: 'Certified professionals with years of experience to guide your fitness journey with personalized attention.',
                  gradient: 'from-orange-500 to-red-500'
                },
                { 
                  icon: Clock, 
                  title: '24/7 Access', 
                  description: 'Round-the-clock access to all facilities, designed to fit perfectly into your busy lifestyle.',
                  gradient: 'from-red-600 to-red-700'
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 relative overflow-hidden"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient}`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 + 0.1 * index }}
                    viewport={{ once: true }}
                  />
                  
                  <motion.div 
                    className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-red-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  />
                </motion.div>
              ))
            )}
          </div>
          
          {/* Call to Action */}
          <motion.div 
            className="text-center mt-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-12 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Explore All Features
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-red-800/10 rounded-full blur-3xl"></div>
        </div>
        
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="inline-block bg-red-600/20 px-4 py-2 rounded-full mb-6"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <span className="text-red-400 font-semibold text-sm tracking-wide uppercase">About Our Gym</span>
              </motion.div>
              
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
                Transform Your 
                <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"> Life</span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                For over a decade, Raju Rapse Gym has been the premier fitness destination, 
                empowering thousands of members to achieve extraordinary results through our 
                innovative approach to health and wellness.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: Award, text: "10+ Years of Excellence", stat: "2013" },
                  { icon: Users, text: "5000+ Happy Members", stat: "5K+" },
                  { icon: Star, text: "Certified Expert Trainers", stat: "50+" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center space-x-4 group"
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 + 0.1 * index }}
                    viewport={{ once: true }}
                  >
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <span className="text-white font-semibold text-lg">{item.text}</span>
                    </div>
                    <div className="text-2xl font-bold text-red-400">{item.stat}</div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="mt-12"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Discover Our Story
                </motion.button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-sm h-96 rounded-2xl flex items-center justify-center border border-red-500/20 relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <motion.div
                  className="text-center z-10"
                  whileHover={{ scale: 1.1 }}
                >
                  <Play className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <span className="text-white text-xl font-semibold">Watch Our Journey</span>
                </motion.div>
                
                {/* Floating elements */}
                <motion.div 
                  className="absolute top-8 right-8 w-4 h-4 bg-red-500 rounded-full"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                />
                <motion.div 
                  className="absolute bottom-12 left-8 w-3 h-3 bg-red-400 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div 
                  className="absolute top-1/2 right-12 w-2 h-2 bg-red-600 rounded-full"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Programs Section */}
      <section className="py-24 bg-white relative">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="text-center mb-20"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Our 
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">Programs</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-700 mx-auto mb-6"/>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose from our comprehensive range of fitness programs designed to meet your unique goals and lifestyle
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  <Skeleton height={200} />
                  <div className="p-6">
                    <Skeleton height={24} className="mb-4" />
                    <Skeleton count={3} className="mb-4" />
                    <Skeleton height={40} width={120} />
                  </div>
                </div>
              ))
            ) : (
              [
                {
                  title: "Strength Training",
                  description: "Build muscle mass and increase overall strength with our comprehensive weight training programs using premium equipment.",
                  features: ["Progressive Overload", "Form Correction", "Custom Routines"],
                  gradient: "from-red-500 to-red-600",
                  bgGradient: "from-red-50 to-red-100"
                },
                {
                  title: "Cardio Fitness",
                  description: "Improve cardiovascular health and burn calories with our dynamic cardio workouts and HIIT programs.",
                  features: ["HIIT Sessions", "Endurance Building", "Fat Burning"],
                  gradient: "from-orange-500 to-red-500",
                  bgGradient: "from-orange-50 to-red-50"
                },
                {
                  title: "Personal Training",
                  description: "Get one-on-one attention with our certified trainers for a completely customized fitness experience.",
                  features: ["1-on-1 Coaching", "Custom Meal Plans", "Progress Tracking"],
                  gradient: "from-red-600 to-red-700",
                  bgGradient: "from-red-50 to-red-100"
                }
              ].map((program, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-gray-100"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className={`bg-gradient-to-br ${program.bgGradient} h-48 flex items-center justify-center relative overflow-hidden`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className={`w-24 h-24 bg-gradient-to-r ${program.gradient} rounded-full flex items-center justify-center`}
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Dumbbell className="w-12 h-12 text-white" />
                    </motion.div>
                    
                    {/* Floating elements */}
                    <motion.div 
                      className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-r ${program.gradient} rounded-full`}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className={`absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r ${program.gradient} rounded-full`}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                  </motion.div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors duration-300">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {program.description}
                    </p>
                    
                    <div className="space-y-2 mb-8">
                      {program.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex}
                          className="flex items-center space-x-2"
                          initial={{ x: -20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.1 * featureIndex }}
                          viewport={{ once: true }}
                        >
                          <div className={`w-2 h-2 bg-gradient-to-r ${program.gradient} rounded-full`}></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full bg-gradient-to-r ${program.gradient} text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300`}
                    >
                      Learn More
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-br from-red-600 to-red-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="text-center mb-20"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Get Started Today
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-6"/>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Ready to transform your life? Join thousands of members who have achieved their fitness goals with us.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div 
              className="text-white"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold mb-12">Contact Information</h3>
              <div className="space-y-8">
                {[
                  { icon: MapPin, text: "123 Fitness Street, Gym City, GC 12345", label: "Address" },
                  { icon: Phone, text: "+1 (555) 123-4567", label: "Phone" },
                  { icon: Mail, text: "info@rajurapsegym.com", label: "Email" },
                  { icon: Calendar, text: "Mon-Sun: 24/7 Open", label: "Hours" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start space-x-4 group"
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 + 0.1 * index }}
                    viewport={{ once: true }}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div 
                      className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="text-red-200 text-sm font-semibold uppercase tracking-wide mb-1">
                        {item.label}
                      </div>
                      <div className="text-white text-lg font-medium">
                        {item.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-bold text-white mb-4">Why Choose Us?</h4>
                <ul className="space-y-2 text-red-100">
                  <li>✓ State-of-the-art equipment</li>
                  <li>✓ Expert personal trainers</li>
                  <li>✓ Flexible membership plans</li>
                  <li>✓ Clean and safe environment</li>
                </ul>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-3xl font-bold text-white mb-8">Send us a Message</h3>
                
                {/* Status Message */}
                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-xl ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-500/20 border border-green-400/30 text-green-100' 
                        : 'bg-red-500/20 border border-red-400/30 text-red-100'
                    }`}
                  >
                    {submitStatus.message}
                  </motion.div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className={`w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-red-200 border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                        validationErrors.name ? 'border-red-400' : 'border-white/20'
                      }`}
                    />
                    {validationErrors.name && (
                      <p className="text-red-300 text-sm mt-1">{validationErrors.name}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    viewport={{ once: true }}
                  >
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your Email"
                      className={`w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-red-200 border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                        validationErrors.email ? 'border-red-400' : 'border-white/20'
                      }`}
                    />
                    {validationErrors.email && (
                      <p className="text-red-300 text-sm mt-1">{validationErrors.email}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your Phone (Optional)"
                      className={`w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-red-200 border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                        validationErrors.phone ? 'border-red-400' : 'border-white/20'
                      }`}
                    />
                    {validationErrors.phone && (
                      <p className="text-red-300 text-sm mt-1">{validationErrors.phone}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    viewport={{ once: true }}
                  >
                    <textarea
                      rows="4"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your Message"
                      className={`w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-red-200 border transition-all duration-300 resize-none focus:outline-none focus:ring-2 focus:ring-white/50 ${
                        validationErrors.message ? 'border-red-400' : 'border-white/20'
                      }`}
                    />
                    {validationErrors.message && (
                      <p className="text-red-300 text-sm mt-1">{validationErrors.message}</p>
                    )}
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                      isSubmitting 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-white text-red-600 hover:bg-red-50'
                    }`}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    viewport={{ once: true }}
                    whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 left-1/4 w-64 h-64 bg-red-600/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="flex items-center space-x-3 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center"
                >
                  <Dumbbell className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Raju Rapse Gym
                </h3>
              </motion.div>
              <p className="text-gray-400 leading-relaxed">
                Your premier destination for fitness and wellness. Transform your life with our state-of-the-art facilities and expert guidance.
              </p>
              
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 text-red-400">Follow Us</h4>
                <div className="flex space-x-4">
                  {[
                    { icon: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z", name: "Twitter" },
                    { icon: "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z", name: "Facebook" },
                    { icon: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z", name: "Instagram" }
                  ].map((social, index) => (
                    <motion.a 
                      key={index}
                      href="#" 
                      className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-all duration-300 group"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d={social.icon}/>
                      </svg>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {[
              {
                title: "Quick Links",
                links: [
                  { name: "Home", to: "/" },
                  { name: "About", to: "/about" },
                  { name: "Programs", to: "/programs" },
                  { name: "Trainers", to: "/trainers" },
                  { name: "Contact", to: "/contact" }
                ]
              },
              {
                title: "Programs",
                links: [
                  { name: "Strength Training" },
                  { name: "Cardio Fitness" },
                  { name: "Personal Training" },
                  { name: "Group Classes" },
                  { name: "Nutrition Coaching" }
                ]
              },
              {
                title: "Support",
                links: [
                  { name: "Membership Plans" },
                  { name: "Schedule Tour" },
                  { name: "FAQ" },
                  { name: "Support Center" },
                  { name: "Privacy Policy" }
                ]
              }
            ].map((section, sectionIndex) => (
              <motion.div 
                key={sectionIndex}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 + 0.1 * sectionIndex }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-semibold mb-6 text-red-400">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li 
                      key={linkIndex}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.to ? (
                        <Link 
                          to={link.to} 
                          className="text-gray-400 hover:text-red-400 transition-colors duration-300 hover:underline"
                        >
                          {link.name}
                        </Link>
                      ) : (
                        <span className="text-gray-400 hover:text-red-400 transition-colors duration-300 cursor-pointer">
                          {link.name}
                        </span>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="border-t border-gray-800 mt-16 pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400">
                &copy; 2024 Raju Rapse Gym. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link to="/privacy" className="text-gray-400 hover:text-red-400 transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-red-400 transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="text-gray-400 hover:text-red-400 transition-colors duration-300">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </footer>

      {/* Membership Inquiry Modal */}
      <MembershipInquiryModal 
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
      />
    </div>
  );
};

export default Homepage;