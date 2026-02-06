import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award,
  Users,
  Calendar,
  Trophy,
  Heart,
  Target,
  Zap,
  Star,
  Quote,
  Dumbbell,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AboutUs = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('story');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      icon: Users,
      number: "5000+",
      label: "Happy Members",
      color: "text-blue-600",
      bg: "bg-blue-50",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Calendar,
      number: "15+",
      label: "Years Experience",
      color: "text-green-600",
      bg: "bg-green-50",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: Trophy,
      number: "100+",
      label: "Awards Won",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      gradient: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Star,
      number: "4.9",
      label: "Rating",
      color: "text-purple-600",
      bg: "bg-purple-50",
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Fitness",
      description: "We are passionate about helping our members achieve their fitness goals and live healthier lives.",
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      icon: Target,
      title: "Goal-Oriented",
      description: "Every member has unique goals, and we provide personalized plans to help them succeed.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a supportive community where everyone motivates each other to reach new heights.",
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We constantly evolve our equipment, programs, and services to provide the best experience.",
      color: "text-yellow-600",
      bg: "bg-yellow-50"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Fitness Enthusiast",
      content: "Raju Rapse Gym has completely transformed my life. The trainers are incredible, and the community is so supportive!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Arjun Patel",
      role: "Professional Athlete",
      content: "The best gym I've ever trained at. State-of-the-art equipment and expert guidance helped me reach new personal records.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Sneha Reddy",
      role: "Working Professional",
      content: "Perfect gym for busy professionals. Flexible timings, efficient workouts, and amazing results in just 3 months!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const milestones = [
    { year: "2009", title: "Founded", description: "Started with a small gym and big dreams" },
    { year: "2012", title: "First Expansion", description: "Added cardio section and group classes" },
    { year: "2015", title: "Award Recognition", description: "Best Gym of the Year award" },
    { year: "2018", title: "Technology Integration", description: "Introduced smart equipment and app" },
    { year: "2020", title: "Virtual Training", description: "Launched online fitness programs" },
    { year: "2024", title: "5000+ Members", description: "Reached a major membership milestone" }
  ];

  const tabs = [
    { id: 'story', label: 'Our Story', icon: Heart },
    { id: 'values', label: 'Our Values', icon: Target },
    { id: 'journey', label: 'Our Journey', icon: TrendingUp }
  ];

  const floatingElements = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 80 + 40,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15
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
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} height={20} width={80} />
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Skeleton */}
        <div className="py-20 text-center">
          <Skeleton height={60} width={300} className="mx-auto mb-4" />
          <Skeleton height={24} width={500} className="mx-auto" />
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton height={80} width={80} className="mx-auto mb-4" />
                <Skeleton height={32} width={80} className="mx-auto mb-2" />
                <Skeleton height={20} width={100} className="mx-auto" />
              </div>
            ))}
          </div>
          
          <div className="space-y-8">
            <Skeleton height={200} />
            <Skeleton height={150} />
            <Skeleton height={180} />
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'story':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">The Beginning</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Founded in 2009 by Raju Rapse, our gym started with a simple mission: to create a space where 
                  people could transform their lives through fitness. What began as a small neighborhood gym has 
                  grown into a premier fitness destination.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Our founder's personal journey from being overweight to achieving peak fitness inspired him to 
                  help others on their transformation journeys. Today, we're proud to be a community of over 5,000 
                  members who support each other every day.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-w-16 aspect-h-12 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"
                    alt="Gym Story"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-xl">
                  <Heart className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'values':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`${value.bg} p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className={`w-16 h-16 ${value.bg} rounded-xl flex items-center justify-center mb-6 ${value.color}`}>
                  <value.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h4>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        );

      case 'journey':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 to-red-600"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="relative flex items-start"
                  >
                    {/* Timeline dot */}
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                      {milestone.year}
                    </div>
                    
                    {/* Content */}
                    <div className="ml-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex-1">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{milestone.title}</h4>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full bg-red-100/20"
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
                { to: '/about', label: 'About', active: true },
                { to: '/programs', label: 'Programs' },
                { to: '/trainers', label: 'Trainers' },
                { to: '/contact', label: 'Contact' }
              ].map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 relative group ${
                      link.active 
                        ? 'text-red-600 bg-red-50' 
                        : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                    }`}
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

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-red-800/5 to-red-900/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-7xl font-bold mb-8"
            >
              <span className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
                About Us
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Discover our journey, mission, and unwavering commitment to your fitness success story
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              className="mt-8 inline-flex items-center gap-2 text-red-600 font-semibold"
            >
              <Award className="w-5 h-5" />
              <span>15+ Years of Excellence</span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`${stat.bg} p-8 rounded-3xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100`}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                
                <motion.h3
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                  className="text-4xl font-bold text-gray-800 mb-2"
                >
                  {stat.number}
                </motion.h3>
                
                <p className="text-gray-600 font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabbed Content Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              What Our Members Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from real people who've transformed their lives with us
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-white" />
                </div>
                
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4 shadow-lg"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-red-600 text-sm font-semibold">{testimonial.role}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                
                <div className="flex text-yellow-400">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Animated background shapes */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-36 -translate-y-36 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48 animate-pulse"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to Start Your Journey?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-red-100 mb-10 max-w-2xl mx-auto"
          >
            Join our community of fitness enthusiasts and transform your life today. Your journey to a better you starts here.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Join Today</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-red-600 transition-all duration-300"
              >
                <MapPin className="w-5 h-5" />
                <span>Visit Us</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUs;