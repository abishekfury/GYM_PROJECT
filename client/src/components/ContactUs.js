import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle2,
  AlertTriangle,
  Dumbbell,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Simulate loading
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
      if (key === 'phone' || key === 'subject') return true; // Optional fields
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
          source: 'contact_page',
          messageType: 'contact'
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
          subject: '',
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

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Location',
      content: '123 Fitness Street, Gym District, City 400001',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+91 9876543210',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: 'info@rajurapseGym.com',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: 'Mon-Sun: 5:00 AM - 11:00 PM',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Youtube, href: '#', label: 'Youtube', color: 'hover:text-red-600' }
  ];

  const floatingElements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Navigation Skeleton */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Skeleton height={32} width={200} />
              <div className="flex space-x-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} height={20} width={80} />
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton height={60} width={400} className="mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                  <Skeleton height={24} width={120} className="mb-2" />
                  <Skeleton height={20} width={200} />
                </div>
              ))}
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <Skeleton height={32} width={200} className="mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton height={20} width={100} className="mb-2" />
                    <Skeleton height={48} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full bg-red-100/30"
            style={{
              width: element.size,
              height: element.size,
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/90 backdrop-blur-sm shadow-xl sticky top-0 z-50 border-b border-red-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Raju Rapse Gym
                </h1>
              </Link>
            </motion.div>
            
            <div className="flex items-center space-x-8">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/programs', label: 'Programs' },
                { to: '/trainers', label: 'Trainers' }
              ].map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-red-50 relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-20 text-center"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent mb-6"
            >
              Get in Touch
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Have questions about our gym, membership plans, or fitness programs? 
              We're here to help you start your fitness journey.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center items-center gap-2 mt-6 text-red-600"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-lg font-semibold">Let's Connect</span>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Information</h2>
                  <p className="text-gray-600 mb-8">
                    Ready to transform your fitness journey? Get in touch with us today!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className={`${info.bg} p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl ${info.bg} ${info.color}`}>
                          <info.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">{info.title}</h3>
                          <p className="text-gray-600 text-sm">{info.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Social Media */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Follow Us</h3>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-gray-600 ${social.color} transition-all duration-300 hover:shadow-lg border border-gray-200`}
                        aria-label={social.label}
                      >
                        <social.icon className="w-6 h-6" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
                
                {/* Status Message */}
                <AnimatePresence>
                  {submitStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`mb-6 p-4 rounded-xl border ${
                        submitStatus.type === 'success'
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-red-50 border-red-200 text-red-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {submitStatus.type === 'success' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5" />
                        )}
                        <span className="text-sm font-medium">{submitStatus.message}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 outline-none ${
                          validationErrors.name
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 focus:border-red-500 focus:ring-red-500/20'
                        } focus:ring-4`}
                        placeholder="Your full name"
                      />
                      {validationErrors.name && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          {validationErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 outline-none ${
                          validationErrors.email
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 focus:border-red-500 focus:ring-red-500/20'
                        } focus:ring-4`}
                        placeholder="your@email.com"
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          {validationErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 outline-none ${
                          validationErrors.phone
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 focus:border-red-500 focus:ring-red-500/20'
                        } focus:ring-4`}
                        placeholder="Your phone number"
                      />
                      {validationErrors.phone && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          {validationErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* Subject Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all duration-300 outline-none"
                        placeholder="Message subject"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 outline-none resize-none ${
                        validationErrors.message
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-200 focus:border-red-500 focus:ring-red-500/20'
                      } focus:ring-4`}
                      placeholder="Tell us about your fitness goals or questions..."
                    />
                    {validationErrors.message && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {validationErrors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || Object.keys(validationErrors).length > 0}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-red-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    
                    <div className="relative flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Send className="w-5 h-5" />
                          </motion.div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-20 bg-gradient-to-r from-red-600 to-red-700"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Fitness Journey?
            </h2>
            <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of members who have already transformed their lives at Raju Rapse Gym.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all duration-300"
              >
                <Dumbbell className="w-5 h-5" />
                <span>Join Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ContactUs;