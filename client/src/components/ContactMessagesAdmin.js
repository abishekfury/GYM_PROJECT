import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  Calendar,
  User,
  MessageSquare,
  Filter,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Reply,
  Trash2,
  Star,
  Download,
  RefreshCw
} from 'lucide-react';

const ContactMessagesAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: 'all',
    messageType: 'all',
    priority: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMessages: 0,
    limit: 20
  });
  const [statistics, setStatistics] = useState({
    unreadCount: 0,
    totalToday: 0,
    priorityBreakdown: {}
  });
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch messages from API
  const fetchMessages = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filter).filter(([key, value]) => value && value !== 'all')
        )
      });

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/contact?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data.messages);
        setPagination(data.data.pagination);
        setStatistics(data.data.statistics);
      }
    } catch (error) {
      // Show error notification
    } finally {
      setLoading(false);
    }
  };

  // Update message status
  const updateMessageStatus = async (messageId, status, adminNotes = '') => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/contact/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, adminNotes })
      });

      if (response.ok) {
        fetchMessages(pagination.currentPage);
        setSelectedMessage(null);
      }
    } catch (error) {
    }
  };

  // Delete message
  const deleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/contact/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchMessages(pagination.currentPage);
        setSelectedMessage(null);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'read': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'replied': return 'bg-green-100 text-green-800 border-green-200';
      case 'resolved': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'membership': return <Star className="w-4 h-4 text-yellow-600" />;
      case 'inquiry': return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'complaint': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'feedback': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      default: return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Messages</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.totalMessages}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.unreadCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Membership</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.priorityBreakdown.high || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filter.messageType}
              onChange={(e) => setFilter({ ...filter, messageType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Types</option>
              <option value="contact">Contact</option>
              <option value="membership">Membership</option>
              <option value="inquiry">Inquiry</option>
              <option value="complaint">Complaint</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={filter.priority}
              onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Message</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {messages.map((message) => (
                <motion.tr
                  key={message._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`hover:bg-gray-50 ${message.status === 'new' ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{message.name}</div>
                      <div className="text-sm text-gray-600">{message.email}</div>
                      {message.phone && (
                        <div className="text-sm text-gray-600">{message.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{message.subject}</div>
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {message.message.substring(0, 100)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getMessageTypeIcon(message.messageType)}
                      <span className="text-sm font-medium capitalize">{message.messageType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium capitalize ${getPriorityColor(message.priority)}`}>
                      {message.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {formatDate(message.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedMessage(message)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateMessageStatus(message._id, 'replied')}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark as Replied"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMessage(message._id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.limit, pagination.totalMessages)} of{' '}
            {pagination.totalMessages} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => fetchMessages(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => fetchMessages(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        {getMessageTypeIcon(selectedMessage.messageType)}
                        <span className="text-sm font-medium capitalize">{selectedMessage.messageType}</span>
                      </div>
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedMessage.status)}`}>
                        {selectedMessage.status}
                      </span>
                      <span className={`text-sm font-medium capitalize ${getPriorityColor(selectedMessage.priority)}`}>
                        {selectedMessage.priority} priority
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-gray-900">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedMessage.email}</p>
                    </div>
                    {selectedMessage.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-gray-900">{selectedMessage.phone}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Source</label>
                      <p className="text-gray-900 capitalize">{selectedMessage.source.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>Received: {formatDate(selectedMessage.createdAt)}</p>
                    {selectedMessage.repliedAt && (
                      <p>Replied: {formatDate(selectedMessage.repliedAt)}</p>
                    )}
                  </div>

                  {selectedMessage.adminNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <p className="text-gray-900">{selectedMessage.adminNotes}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => updateMessageStatus(selectedMessage._id, 'read')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => updateMessageStatus(selectedMessage._id, 'replied')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Mark as Replied
                  </button>
                  <button
                    onClick={() => updateMessageStatus(selectedMessage._id, 'resolved')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactMessagesAdmin;