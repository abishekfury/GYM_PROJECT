import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell,
  Clock,
  Users,
  Target,
  Zap,
  Heart,
  Trophy,
  Activity,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Star,
  Play
} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import MembershipInquiryModal from './MembershipInquiryModal';

const ProgramPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const programs = [
    {
      id: 1,
      title: "Strength Training",
      category: "strength",
      duration: "60 mins",
      level: "Beginner to Advanced",
      participants: "1-8",
      description: "Build muscle mass and increase strength with our comprehensive weight training program.",
      features: ["Personal Training", "Progressive Overload", "Nutrition Guidance", "Form Correction"],
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=250&fit=crop",
      price: "₹2,000/month",
      gradient: "from-red-500 to-red-600",
      popular: true
    },
    {
      id: 2,
      title: "Cardio Blast",
      category: "cardio",
      duration: "45 mins",
      level: "All Levels",
      participants: "10-15",
      description: "High-intensity cardio workouts to burn calories and improve cardiovascular health.",
      features: ["HIIT Training", "Fat Burning", "Endurance Building", "Group Motivation"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
      price: "₹1,500/month",
      gradient: "from-blue-500 to-blue-600",
      popular: false
    },
    {
      id: 3,
      title: "Yoga & Flexibility",
      category: "flexibility",
      duration: "60 mins",
      level: "Beginner",
      participants: "8-12",
      description: "Improve flexibility, balance, and mental wellness through yoga and stretching.",
      features: ["Stress Relief", "Flexibility", "Mind-Body Connection", "Breathing Techniques"],
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop",
      price: "₹1,200/month",
      gradient: "from-green-500 to-green-600",
      popular: false
    },
    {
      id: 4,
      title: "Functional Fitness",
      category: "functional",
      duration: "50 mins",
      level: "Intermediate",
      participants: "6-10",
      description: "Real-world movement patterns to improve daily functional activities.",
      features: ["Movement Quality", "Core Strength", "Balance Training", "Injury Prevention"],
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop",
      price: "₹1,800/month",
      gradient: "from-purple-500 to-purple-600",
      popular: false
    },
    {
      id: 5,
      title: "CrossFit Training",
      category: "crossfit",
      duration: "55 mins",
      level: "Advanced",
      participants: "8-12",
      description: "High-intensity functional movement workouts that build strength and conditioning.",
      features: ["Olympic Lifts", "Metabolic Conditioning", "Competition Prep", "Community Support"],
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=250&fit=crop",
      price: "₹2,500/month",
      gradient: "from-orange-500 to-orange-600",
      popular: true
    },
    {
      id: 6,
      title: "Personal Training",
      category: "personal",
      duration: "60 mins",
      level: "All Levels",
      participants: "1-on-1",
      description: "Customized one-on-one training sessions tailored to your specific goals.",
      features: ["Personalized Workout", "Goal Setting", "Nutrition Planning", "Progress Tracking"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
      price: "₹4,000/month",
      gradient: "from-teal-500 to-teal-600",
      popular: false
    }
  ];

  const categories = [
    { id: 'all', label: 'All Programs', icon: Target },
    { id: 'strength', label: 'Strength', icon: Dumbbell },
    { id: 'cardio', label: 'Cardio', icon: Heart },
    { id: 'flexibility', label: 'Flexibility', icon: Activity },
    { id: 'functional', label: 'Functional', icon: Zap },
    { id: 'crossfit', label: 'CrossFit', icon: Trophy },
    { id: 'personal', label: 'Personal', icon: Users }
  ];

  const filteredPrograms = selectedCategory === 'all' 
    ? programs 
    : programs.filter(program => program.category === selectedCategory);

  if (isLoading)  {
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
          <Skeleton height={60} width={400} className="mx-auto mb-4" />
          <Skeleton height={24} width={600} className="mx-auto" />
        </div>

        {/* Programs Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center mb-8">
            <Skeleton height={50} width={600} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6">
                <Skeleton height={200} className="mb-4" />
                <Skeleton height={24} width={200} className="mb-2" />
                <Skeleton height={60} className="mb-4" />
                <Skeleton height={40} width={120} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
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
                { to: '/programs', label: 'Programs', active: true },
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
        className="py-24 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/5 via-red-800/3 to-red-900/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold mb-8"
          >
            <span className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
              Our Programs
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Discover our comprehensive fitness programs designed to help you achieve your goals, 
            no matter your fitness level or experience.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            className="mt-8 inline-flex items-center gap-2 text-red-600 font-semibold"
          >
            <Play className="w-5 h-5" />
            <span>Find Your Perfect Program</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPrograms.map((program, index) => (
                <motion.div
                  key={program.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group relative"
                >
                  {program.popular && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        POPULAR
                      </span>
                    </div>
                  )}

                  {/* Program Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-8">
                    {/* Program Header */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{program.title}</h3>
                      <p className="text-gray-600">{program.description}</p>
                    </div>

                    {/* Program Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4 text-red-500" />
                        <span>{program.participants}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Target className="w-4 h-4 text-red-500" />
                        <span>{program.level}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span>Daily</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-800 mb-3">What's Included:</h4>
                      <div className="space-y-2">
                        {program.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">{program.price}</span>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMembershipModalOpen(true)}
                        className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${program.gradient} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
                      >
                        <span>Join Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
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
            Start Your Fitness Journey Today
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-red-100 mb-10 max-w-2xl mx-auto"
          >
            Choose your program and take the first step towards a healthier, stronger you. 
            Our expert trainers are here to guide you every step of the way.
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
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-red-600 transition-all duration-300"
              >
                <Activity className="w-5 h-5" />
                <span>Learn More</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Membership Inquiry Modal */}
      <MembershipInquiryModal 
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
      />
    </div>
  );
};

export default ProgramPage;