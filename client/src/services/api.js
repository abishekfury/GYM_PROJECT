import axios from 'axios';

// Force the correct API URL
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getToken = () => {
  const token = localStorage.getItem('authToken');
  return token;
};

const removeToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('user');
  localStorage.removeItem('adminInfo');
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    
    if (error.response) {
      const { status } = error.response;
      
      // Only handle 401 errors for protected routes, and only after a delay
      if (status === 401) {
        const isLoginRequest = error.config?.url?.includes('/auth/login');
        const isVerifyRequest = error.config?.url?.includes('/auth/verify');
        const isDashboardRequest = error.config?.url?.includes('/dashboard/stats');
        
        if (!isLoginRequest && !isVerifyRequest && isDashboardRequest) {
          
          // Don't automatically logout on dashboard 401 errors during initial load
          // Let the user manually logout if needed
        } else if (!isLoginRequest && !isVerifyRequest && !isDashboardRequest) {
          
          setTimeout(() => {
            const currentToken = getToken();
            if (!currentToken) {
              removeToken();
              if (!window.location.pathname.includes('login')) {
                window.location.href = '/login';
              }
            }
          }, 1000);
        }
      }
      
      // Handle other errors
    } else if (error.request) {
    } else {
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  // Admin login
  login: async (credentials) => {
    try {

      const response = await api.post('/auth/login', credentials);
      
      if (!response.data || !response.data.token) {
        throw new Error('No token received from server');
      }
      
      const { token, admin } = response.data;
            
      // Force save to localStorage immediately
      localStorage.setItem('authToken', token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', admin.username);
      localStorage.setItem('adminInfo', JSON.stringify(admin));
      
      // Verify it was saved
      const savedToken = localStorage.getItem('authToken');
      
      if (!savedToken) {
        throw new Error('Failed to save token to localStorage');
      }
      
      return response.data;
    } catch (error) {
      if (error.response) {
      }
      throw new Error(error.response?.data?.error || error.message || 'Login failed');
    }
  },

  // Verify token
  verify: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      removeToken();
      throw new Error(error.response?.data?.error || 'Token verification failed');
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
    } finally {
      removeToken();
    }
  },

  // Setup default admin (for first-time setup)
  setup: async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/setup`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Setup failed');
    }
  }
};

// Members API (protected)
export const membersAPI = {
  // Get all members
  getAll: async () => {
    const response = await api.get('/members');
    return response.data;
  },

  // Get member by ID
  getById: async (id) => {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },

  // Get member by code
  getByCode: async (code) => {
    const response = await api.get(`/members/code/${code}`);
    return response.data;
  },

  // Create member
  create: async (memberData) => {
    const response = await api.post('/members', memberData);
    return response.data;
  },

  // Update member
  update: async (id, memberData) => {
    const response = await api.put(`/members/${id}`, memberData);
    return response.data;
  },

  // Update member by code
  updateByCode: async (code, memberData) => {
    const response = await api.put(`/members/code/${code}`, memberData);
    return response.data;
  },

  // Delete member
  delete: async (id) => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  },

  // Delete member by code
  deleteByCode: async (code) => {
    const response = await api.delete(`/members/code/${code}`);
    return response.data;
  }
};

// Dashboard API (protected)
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};

// Finance API (protected)
export const financeAPI = {
  // Income endpoints
  getIncome: async (params = {}) => {
    const response = await api.get('/finance/income', { params });
    return response.data;
  },

  getIncomeById: async (id) => {
    const response = await api.get(`/finance/income/${id}`);
    return response.data;
  },

  createIncome: async (data) => {
    const response = await api.post('/finance/income', data);
    return response.data;
  },

  updateIncome: async (id, data) => {
    const response = await api.put(`/finance/income/${id}`, data);
    return response.data;
  },

  deleteIncome: async (id) => {
    const response = await api.delete(`/finance/income/${id}`);
    return response.data;
  },

  // Expense endpoints
  getExpenses: async (params = {}) => {
    const response = await api.get('/finance/expenses', { params });
    return response.data;
  },

  getExpenseById: async (id) => {
    const response = await api.get(`/finance/expenses/${id}`);
    return response.data;
  },

  createExpense: async (data) => {
    const response = await api.post('/finance/expenses', data);
    return response.data;
  },

  updateExpense: async (id, data) => {
    const response = await api.put(`/finance/expenses/${id}`, data);
    return response.data;
  },

  deleteExpense: async (id) => {
    const response = await api.delete(`/finance/expenses/${id}`);
    return response.data;
  },

  // Financial summary
  getFinancialSummary: async (params = {}) => {
    const response = await api.get('/finance/summary', { params });
    return response.data;
  }
};

// Utility functions
export const apiUtils = {
  isAuthenticated: () => {
    const token = getToken();
    return !!token;
  },

  getStoredUser: () => {
    try {
      const adminInfo = localStorage.getItem('adminInfo');
      return adminInfo ? JSON.parse(adminInfo) : null;
    } catch {
      return null;
    }
  },

  clearAuth: () => {
    removeToken();
  },

  // Backward compatibility
  removeToken: () => {
    removeToken();
  }
};

export default api;