import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Phone,
  Mail,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserPlus
} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { membersAPI } from '../services/api';

const ShimmerMemberCard = () => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
    <div className="flex items-center space-x-4">
      <Skeleton height={64} width={64} circle />
      <div className="flex-1">
        <Skeleton height={20} width="60%" className="mb-2" />
        <Skeleton height={16} width="40%" className="mb-1" />
        <Skeleton height={16} width="50%" />
      </div>
      <div className="flex flex-col items-end space-y-2">
        <Skeleton height={24} width={80} />
        <div className="flex space-x-2">
          <Skeleton height={32} width={32} />
          <Skeleton height={32} width={32} />
          <Skeleton height={32} width={32} />
        </div>
      </div>
    </div>
  </div>
);

const MemberCard = ({ member, index, onView, onEdit, onDelete }) => {
  const getPaymentStatus = () => {
    const { paidAmount, planAmount } = member;
    if (paidAmount >= planAmount) return { status: 'Paid', color: 'bg-green-100 text-green-800' };
    if (paidAmount > 0) return { status: 'Partial', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'Pending', color: 'bg-red-100 text-red-800' };
  };

  const getMembershipStatus = () => {
    const today = new Date();
    const expiry = new Date(member.expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: 'Expired', color: 'bg-red-100 text-red-800' };
    } else if (daysUntilExpiry <= 7) {
      return { status: 'Expiring Soon', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'Active', color: 'bg-green-100 text-green-800' };
    }
  };

  const paymentStatus = getPaymentStatus();
  const membershipStatus = getMembershipStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.3 }}
          >
            {member.name?.charAt(0) || 'N'}
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
              {member.name}
            </h3>
            <p className="text-sm text-gray-500 flex items-center">
              <span className="font-medium mr-2">#{member.memberCode}</span>
              <span className="text-gray-300">•</span>
              <span className="ml-2">{member.phone}</span>
            </p>
            <div className="flex items-center space-x-3 mt-2">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${membershipStatus.color}`}>
                {membershipStatus.status}
              </span>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${paymentStatus.color}`}>
                {paymentStatus.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onView(member)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(member)}
            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
            title="Edit Member"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(member)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
            title="Delete Member"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    let filtered = members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.memberCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm)
    );

    if (filterStatus !== 'all') {
      filtered = filtered.filter(member => {
        const today = new Date();
        const expiry = new Date(member.expiryDate);
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        
        if (filterStatus === 'active') return daysUntilExpiry > 7;
        if (filterStatus === 'expiring') return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
        if (filterStatus === 'expired') return daysUntilExpiry < 0;
        return true;
      });
    }

    setFilteredMembers(filtered);
  }, [searchTerm, members, filterStatus]);

  const fetchMembers = async () => {
    try {
      const data = await membersAPI.getAll();
      setMembers(data);
      setFilteredMembers(data);
      setLoading(false);
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.message || 'Failed to fetch members'
      });
      setLoading(false);
    }
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

  const handleEditMember = (member) => {
    setEditingMember({ ...member });
    setEditDialogOpen(true);
    setDialogOpen(false); // Close view dialog if open
  };

  const handleDeleteMember = (member) => {
  };

  const updateMember = async (updatedMember) => {
    try {
      await membersAPI.update(updatedMember._id, updatedMember);
      
      // Update local state
      setMembers(prev => 
        prev.map(member => 
          member._id === updatedMember._id ? updatedMember : member
        )
      );
      
      setEditDialogOpen(false);
      setEditingMember(null);
      
      setAlert({
        show: true,
        type: 'success',
        message: 'Member updated successfully!'
      });
      
      // Auto-hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, type: '', message: '' });
      }, 3000);
      
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.message || 'Failed to update member'
      });
      
      // Auto-hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, type: '', message: '' });
      }, 3000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getStats = () => {
    const today = new Date();
    const activeCount = members.filter(member => {
      const expiry = new Date(member.expiryDate);
      return expiry > today;
    }).length;
    
    const expiredCount = members.filter(member => {
      const expiry = new Date(member.expiryDate);
      return expiry <= today;
    }).length;
    
    const expiringCount = members.filter(member => {
      const expiry = new Date(member.expiryDate);
      const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
    }).length;

    return { activeCount, expiredCount, expiringCount };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Users className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Members List</h1>
              <p className="text-gray-500">Manage your gym members and their memberships</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Member</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Active Members</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Expiring Soon</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.expiringCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Expired</p>
              <p className="text-2xl font-bold text-red-600">{stats.expiredCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search members by name, code, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          <div className="flex space-x-2">
            {['all', 'active', 'expiring', 'expired'].map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Members Grid */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <ShimmerMemberCard key={index} />
            ))}
          </div>
        ) : filteredMembers.length > 0 ? (
          <AnimatePresence>
            {filteredMembers.map((member, index) => (
              <MemberCard
                key={member._id || index}
                member={member}
                index={index}
                onView={handleViewMember}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
              />
            ))}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Members Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first member'}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Member Details Modal */}
      <AnimatePresence>
        {dialogOpen && selectedMember && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDialogOpen(false)}
          >
            <motion.div 
              className="bg-white rounded-xl p-6 w-full max-w-md"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedMember.name?.charAt(0) || 'N'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedMember.name}</h3>
                    <p className="text-gray-500">#{selectedMember.memberCode}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{selectedMember.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Membership Plan</p>
                    <p className="font-medium text-gray-900">{selectedMember.membershipPlan}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Join Date</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedMember.joinDate)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedMember.expiryDate)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Details</p>
                    <p className="font-medium text-gray-900">
                      ₹{selectedMember.paidAmount} / ₹{selectedMember.planAmount}
                    </p>
                    <p className="text-sm text-gray-500">{selectedMember.paymentMethod}</p>
                  </div>
                </div>

                {selectedMember.address && (
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-900">{selectedMember.address}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  onClick={() => setDialogOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Close
                </motion.button>
                <motion.button
                  onClick={() => handleEditMember(selectedMember)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Edit Member
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Member Modal */}
      <AnimatePresence>
        {editDialogOpen && editingMember && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditDialogOpen(false)}
          >
            <motion.div 
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Member</h2>
                <button
                  onClick={() => setEditDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  ×
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                updateMember(editingMember);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingMember.name || ''}
                      onChange={(e) => setEditingMember(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editingMember.phone || ''}
                      onChange={(e) => setEditingMember(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Membership Plan
                    </label>
                    <select
                      value={editingMember.membershipPlan || ''}
                      onChange={(e) => setEditingMember(prev => ({ ...prev, membershipPlan: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Plan</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Half Yearly">Half Yearly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={editingMember.planAmount || ''}
                      onChange={(e) => setEditingMember(prev => ({ ...prev, planAmount: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Paid Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={editingMember.paidAmount || ''}
                      onChange={(e) => setEditingMember(prev => ({ ...prev, paidAmount: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={editingMember.paymentMethod || ''}
                      onChange={(e) => setEditingMember(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Method</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Join Date
                    </label>
                    <input
                      type="date"
                      value={editingMember.joinDate ? editingMember.joinDate.split('T')[0] : ''}
                      onChange={(e) => setEditingMember(prev => ({ ...prev, joinDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={editingMember.expiryDate ? editingMember.expiryDate.split('T')[0] : ''}
                      onChange={(e) => setEditingMember(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={editingMember.address || ''}
                    onChange={(e) => setEditingMember(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter address (optional)"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <motion.button
                    type="button"
                    onClick={() => setEditDialogOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    Update Member
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert Messages */}
      {alert.show && (
        <motion.div 
          className={`fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg ${
            alert.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            {alert.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span>{alert.message}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MembersList;