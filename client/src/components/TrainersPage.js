import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell,
  Star,
  Award,
  Calendar,
  Users,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TrainersPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const trainers = [
    {
      id: 1,
      name: "Raju Rapse",
      title: "Head Trainer & Founder",
      specialty: "strength",
      experience: "15+ years",
      certifications: ["ACSM Certified", "Nutrition Specialist", "Powerlifting Coach"],
      bio: "Founder and head trainer with over 15 years of experience in transforming lives through fitness.",
      rating: 4.9,
      clients: 500,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face",
      specialties: ["Strength Training", "Weight Loss", "Muscle Building"],
      social: {
        instagram: "#",
        facebook: "#",
        twitter: "#"
      },
      featured: true
    },
    {
      id: 2,
      name: "Priya Sharma",
      title: "Yoga & Wellness Instructor",
      specialty: "yoga",
      experience: "8 years",
      certifications: ["RYT 500", "Meditation Teacher", "Wellness Coach"],
      bio: "Certified yoga instructor specializing in traditional Hatha and modern Vinyasa yoga styles.",
      rating: 4.8,
      clients: 200,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      specialties: ["Hatha Yoga", "Vinyasa", "Meditation"],
      social: {
        instagram: "#",
        facebook: "#",
        twitter: "#"
      },
      featured: false
    },
    {
      id: 3,
      name: "Arjun Patel",
      title: "CrossFit & HIIT Specialist",
      specialty: "crossfit",
      experience: "10 years",
      certifications: ["CrossFit Level 3", "HIIT Specialist", "Olympic Lifting"],
      bio: "Former competitive athlete turned trainer, specializing in high-intensity functional movements.",
      rating: 4.9,
      clients: 150,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      specialties: ["CrossFit", "HIIT", "Functional Training"],
      social: {
        instagram: "#",
        facebook: "#",
        twitter: "#"
      },
      featured: true
    },
    {
      id: 4,
      name: "Sneha Reddy",
      title: "Cardio & Dance Fitness",
      specialty: "cardio",
      experience: "6 years",
      certifications: ["Zumba Instructor", "Aerobics Certified", "Dance Fitness"],
      bio: "Energetic instructor who makes cardio fun through dance and creative workouts.",
      rating: 4.7,
      clients: 180,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      specialties: ["Zumba", "Aerobics", "Dance Fitness"],
      social: {
        instagram: "#",
        facebook: "#",
        twitter: "#"
      },
      featured: false
    },
    {
      id: 5,
      name: "Vikram Singh",
      title: "Personal Training Specialist",
      specialty: "personal",
      experience: "12 years",
      certifications: ["NASM-CPT", "Corrective Exercise", "Sports Nutrition"],
      bio: "Personal trainer with expertise in corrective exercise and sports-specific training programs.",
      rating: 4.8,
      clients: 300,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      specialties: ["Personal Training", "Corrective Exercise", "Sports Training"],
      social: {
        instagram: "#",
        facebook: "#",
        twitter: "#"
      },
      featured: false
    },
    {
      id: 6,
      name: "Anita Kumar",
      title: "Nutrition & Wellness Coach",
      specialty: "nutrition",
      experience: "9 years",
      certifications: ["Certified Nutritionist", "Wellness Coach", "Weight Management"],
      bio: "Holistic approach to fitness combining proper nutrition with effective exercise programs.",
      rating: 4.9,
      clients: 250,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      specialties: ["Nutrition Coaching", "Weight Management", "Lifestyle Design"],
      social: {
        instagram: "#",
        facebook: "#",
        twitter: "#"
      },
      featured: true
    }
  ];

  const specialties = [
    { id: 'all', label: 'All Trainers', icon: Users },
    { id: 'strength', label: 'Strength', icon: Dumbbell },
    { id: 'yoga', label: 'Yoga', icon: Star },
    { id: 'crossfit', label: 'CrossFit', icon: Award },
    { id: 'cardio', label: 'Cardio', icon: Calendar },
    { id: 'personal', label: 'Personal', icon: Users },
    { id: 'nutrition', label: 'Nutrition', icon: CheckCircle2 }
  ];

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSpecialty = selectedSpecialty === 'all' || trainer.specialty === selectedSpecialty;
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSpecialty && matchesSearch;
  });

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
          <Skeleton height={60} width={400} className="mx-auto mb-4" />
          <Skeleton height={24} width={600} className="mx-auto" />
        </div>

        {/* Trainers Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6">
                <Skeleton height={200} className="mb-4" />
                <Skeleton height={24} width={200} className="mb-2" />
                <Skeleton height={20} width={150} className="mb-4" />
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
                { to: '/programs', label: 'Programs' },
                { to: '/trainers', label: 'Trainers', active: true },
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
              Meet Our Trainers
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Our certified fitness professionals are here to guide you on your fitness journey 
            with expertise, motivation, and personalized attention.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            className="mt-8 inline-flex items-center gap-2 text-red-600 font-semibold"
          >
            <Award className="w-5 h-5" />
            <span>Expert Certified Professionals</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Filter and Search */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="relative flex-1 max-w-md"
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search trainers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 outline-none"
              />
            </motion.div>

            {/* Filter Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap gap-3"
            >
              {specialties.map((specialty, index) => (
                <motion.button
                  key={specialty.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSpecialty(specialty.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    selectedSpecialty === specialty.id
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200'
                  }`}
                >
                  <specialty.icon className="w-4 h-4" />
                  <span>{specialty.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trainers Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredTrainers.map((trainer, index) => (
                <motion.div
                  key={trainer.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group relative"
                >
                  {trainer.featured && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        FEATURED
                      </span>
                    </div>
                  )}

                  {/* Trainer Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Social Links Overlay */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a href={trainer.social.instagram} className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:text-red-600 transition-colors">
                        <Instagram className="w-4 h-4" />
                      </a>
                      <a href={trainer.social.facebook} className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:text-red-600 transition-colors">
                        <Facebook className="w-4 h-4" />
                      </a>
                      <a href={trainer.social.twitter} className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:text-red-600 transition-colors">
                        <Twitter className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="p-8">
                    {/* Trainer Header */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">{trainer.name}</h3>
                      <p className="text-red-600 font-semibold mb-2">{trainer.title}</p>
                      <p className="text-gray-600 text-sm">{trainer.bio}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-gray-800">{trainer.rating}</div>
                        <div className="text-gray-600 flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>Rating</span>
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <div className="text-2xl font-bold text-gray-800">{trainer.clients}</div>
                        <div className="text-gray-600 flex items-center justify-center gap-1">
                          <Users className="w-4 h-4 text-red-500" />
                          <span>Clients</span>
                        </div>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-800 mb-3">Specialties:</h4>
                      <div className="flex flex-wrap gap-2">
                        {trainer.specialties.map((specialty, specialtyIndex) => (
                          <span
                            key={specialtyIndex}
                            className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span>{trainer.experience}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="w-4 h-4 text-red-500" />
                        <span>{trainer.certifications.length} Certs</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      <span>Book Session</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* No Results */}
          {filteredTrainers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No trainers found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSelectedSpecialty('all');
                  setSearchTerm('');
                }}
                className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
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
            Ready to Train with the Best?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-red-100 mb-10 max-w-2xl mx-auto"
          >
            Book a session with our expert trainers and accelerate your fitness journey. 
            Personalized training plans designed just for you.
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
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-red-600 transition-all duration-300"
              >
                <Calendar className="w-5 h-5" />
                <span>View Programs</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default TrainersPage;