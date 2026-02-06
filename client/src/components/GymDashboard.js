import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Activity, 
  DollarSign,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  RefreshCw,
  LogOut,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { membersAPI, dashboardAPI } from '../services/api';

const ShimmerCard = () => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <Skeleton height={20} width="60%" className="mb-2" />
        <Skeleton height={32} width="40%" />
      </div>
      <Skeleton height={56} width={56} circle />
    </div>
  </div>
);

const StatCard = ({ title, value, icon: Icon, color, gradient, bgColor, isLoading }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300"
  >
    <div className={`h-2 bg-gradient-to-r ${gradient}`} />
    <div className="p-6">
      {isLoading ? (
        <ShimmerCard />
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">
              {title}
            </p>
            <motion.p 
              className="text-3xl font-bold text-gray-900"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {value}
            </motion.p>
          </div>
          <motion.div 
            className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="w-7 h-7 text-white" />
          </motion.div>
        </div>
      )}
    </div>
  </motion.div>
);

const getMembershipStatus = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) {
    return { status: 'Expired', color: 'error' };
  } else if (daysUntilExpiry <= 7) {
    return { status: 'Expiring Soon', color: 'warning' };
  } else {
    return { status: 'Active', color: 'success' };
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN');
};

const TableRow = ({ member, index, onEdit, onDelete }) => {
  const membershipStatus = getMembershipStatus(member.expiryDate);
  
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="hover:bg-gray-50 transition-colors duration-200"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <motion.div 
            className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
            whileHover={{ scale: 1.1 }}
          >
            {member.name?.charAt(0) || 'N'}
          </motion.div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{member.name}</div>
            <div className="text-sm text-gray-500">{member.phone}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
          membershipStatus.color === 'success' 
            ? 'bg-green-100 text-green-800' 
            : membershipStatus.color === 'warning'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {membershipStatus.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(member.expiryDate)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ₹{member.paidAmount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(member)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(member)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

// Navigation Menu Component
const NavigationMenu = ({ onLogout, user }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Overview and analytics'
    },
    {
      path: '/admin/members',
      label: 'Members List',
      icon: Users,
      description: 'View all gym members'
    },
    {
      path: '/admin/register',
      label: 'Add Member',
      icon: UserPlus,
      description: 'Register new members'
    },
    {
      path: '/admin/finance',
      label: 'Finance',
      icon: DollarSign,
      description: 'Income & expenses'
    }
  ];

  return (
    <div className="bg-white shadow-lg border-b border-gray-200 mb-8">
      <div className="w-full px-3">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Activity className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gym Admin Panel</h1>
              <p className="text-sm text-gray-500">Welcome, {user || 'Admin'}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-red-100 text-red-700 shadow-md' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logout Button */}
            {onLogout && (
              <motion.button
                onClick={onLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4 w-full"
          >
            <div className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-red-100 text-red-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const GymDashboard = ({ onLogout, user }) => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    expiredMembers: 0,
    todayJoined: 0,
    monthlyRevenue: 0
  });
  const [recentMembers, setRecentMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [editOpen, setEditOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', paidAmount: '' });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  useEffect(() => {
    // Small delay to ensure authentication is fully set up
    const timer = setTimeout(() => {
      fetchDashboardData();
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('🏋️ GymDashboard: Fetching dashboard data...');
      const statsData = await dashboardAPI.getStats();
      console.log('📊 Dashboard stats received:', statsData);
      setStats(statsData);

      const membersData = await membersAPI.getAll();
      const recent = membersData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentMembers(recent);

      setLoading(false);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setAlert({
        show: true,
        type: 'error',
        message: error.message || 'Failed to fetch dashboard data'
      });
      setLoading(false);
    }
  };

  const openEdit = (member) => {
    setEditingMember(member);
    setEditForm({ name: member.name || '', phone: member.phone || '', paidAmount: member.paidAmount || '' });
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditingMember(null);
  };

  const saveEdit = async () => {
    if (!editingMember) return;
    try {
      const payload = {
        name: editForm.name,
        phone: editForm.phone,
        paidAmount: Number(editForm.paidAmount)
      };
      
      await membersAPI.updateByCode(editingMember.memberCode, payload);
      
      setRecentMembers((prev) => prev.map((m) => (m.memberCode === editingMember.memberCode ? { ...m, ...payload } : m)));
      setAlert({ show: true, type: 'success', message: 'Member updated successfully' });
      closeEdit();
      setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    } catch (err) {
      console.error('Edit error', err);
      setAlert({ show: true, type: 'error', message: err.message || 'Failed to update member' });
      setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    }
  };

  const handleDelete = (member) => {
    if (!member || !member.memberCode) {
      setAlert({ show: true, type: 'error', message: 'Invalid member' });
      setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
      return;
    }
    setMemberToDelete(member);
    setConfirmOpen(true);
  };

  const performDelete = async () => {
    if (!memberToDelete) return;
    try {
      await membersAPI.deleteByCode(memberToDelete.memberCode);
      setRecentMembers((prev) => prev.filter((m) => m.memberCode !== memberToDelete.memberCode));
      setAlert({ show: true, type: 'success', message: 'Member deleted' });
      setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    } catch (err) {
      console.error('Delete error', err);
      setAlert({ show: true, type: 'error', message: err.message || 'Failed to delete member' });
      setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    } finally {
      setConfirmOpen(false);
      setMemberToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Menu */}
      <NavigationMenu onLogout={onLogout} user={user} />
      
      {/* Main Content */}
      <div className="w-full px-3">
        {/* Page Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <BarChart3 className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500">
                  Here's what's happening at your gym today.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={fetchDashboardData}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </motion.button>
            </div>
          </div>
        {lastUpdated && (
          <motion.p 
            className="text-sm text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Last updated: {lastUpdated.toLocaleTimeString()}
          </motion.p>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={Users}
          gradient="from-blue-500 to-blue-600"
          bgColor="bg-blue-500"
          isLoading={loading}
        />
        <StatCard
          title="Active Members"
          value={stats.activeMembers}
          icon={CheckCircle}
          gradient="from-green-500 to-green-600"
          bgColor="bg-green-500"
          isLoading={loading}
        />
        <StatCard
          title="Expired Members"
          value={stats.expiredMembers}
          icon={AlertTriangle}
          gradient="from-red-500 to-red-600"
          bgColor="bg-red-500"
          isLoading={loading}
        />
        <StatCard
          title="Today Joined"
          value={stats.todayJoined}
          icon={UserPlus}
          gradient="from-purple-500 to-purple-600"
          bgColor="bg-purple-500"
          isLoading={loading}
        />
      </div>

      {/* Recent Members Table */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Recent Members</h2>
            </div>
            <motion.div
              className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              {recentMembers.length} members
            </motion.div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 py-4">
                  <Skeleton height={40} width={40} circle />
                  <div className="flex-1">
                    <Skeleton height={16} width="30%" className="mb-2" />
                    <Skeleton height={14} width="20%" />
                  </div>
                  <Skeleton height={24} width={80} />
                  <Skeleton height={16} width={100} />
                  <Skeleton height={16} width={60} />
                  <div className="flex space-x-2">
                    <Skeleton height={32} width={32} />
                    <Skeleton height={32} width={32} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentMembers.map((member, index) => (
                  <TableRow
                    key={member.memberCode || index}
                    member={member}
                    index={index}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {recentMembers.length === 0 && !loading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No members found</p>
          </motion.div>
        )}
      </motion.div>

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

      {/* Edit Modal */}
      {editOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4">Edit Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
                <input
                  type="number"
                  value={editForm.paidAmount}
                  onChange={(e) => setEditForm({ ...editForm, paidAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                onClick={closeEdit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={saveEdit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Confirmation Dialog */}
      {confirmOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                <p className="text-gray-600">Are you sure you want to delete this member?</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <motion.button
                onClick={() => setConfirmOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={performDelete}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </div> {/* End of main content container */}
    </div>
  );
};

export default GymDashboard;