import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import { Dumbbell } from 'lucide-react';

import Homepage from './components/Homepage';
import AboutUs from './components/AboutUs';
import ProgramPage from './components/ProgramPage';
import TrainersPage from './components/TrainersPage';
import ContactUs from './components/ContactUs';
import LoginPage from './components/LoginPage';
import MemberRegistration from './components/MemberRegistration';
import MembersList from './components/MembersList';
import GymDashboard from './components/GymDashboard';
import IncomeExpenseManager from './components/IncomeExpenseManager';
import AdminNavigation from './components/AdminNavigation';
import { authAPI, apiUtils } from './services/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#9333ea', // purple-600
    },
    secondary: {
      main: '#000000', // black
    },
    background: {
      default: '#ffffff', // white
      paper: '#ffffff',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check for existing authentication on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isAuthenticated = apiUtils.isAuthenticated();
        const storedUser = apiUtils.getStoredUser();
        
        console.log('🔍 Initial auth check:', { isAuthenticated, storedUser });
        
        if (isAuthenticated && storedUser) {
          // Try to verify the token with the server (with timeout for production)
          try {
            const verifyResult = await Promise.race([
              authAPI.verify(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Verification timeout')), 5000))
            ]);
            setIsLoggedIn(true);
            setUser(storedUser.username);
            console.log('✅ Token verified successfully', verifyResult);
          } catch (verifyError) {
            console.log('❌ Token verification failed (using fallback):', verifyError.message);
            
            // For production fallback, if we have stored auth data, assume it's valid
            if (process.env.NODE_ENV === 'production' && storedUser) {
              console.log('🔄 Using fallback authentication for production');
              setIsLoggedIn(true);
              setUser(storedUser.username);
            } else {
              // Token is invalid, clear it
              apiUtils.clearAuth();
              setIsLoggedIn(false);
              setUser(null);
            }
          }
        } else {
          console.log('❌ No valid authentication found');
        }
      } catch (error) {
        console.error('Error during auth check:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      console.log('🔐 App handleLogin called with:', credentials);
      
      // Try API login first (with timeout for production)
      try {
        console.log('🔐 Calling authAPI.login...');
        const response = await Promise.race([
          authAPI.login(credentials),
          new Promise((_, reject) => setTimeout(() => reject(new Error('API timeout')), 8000))
        ]);
        
        console.log('🔐 authAPI.login returned:', response);
        
        if (response.success) {
          console.log('🔐 Login successful, setting app state');
          
          // Wait a moment to ensure localStorage is updated
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // Verify token is actually saved
          const savedToken = localStorage.getItem('authToken');
          console.log('🔐 Verifying saved token:', savedToken ? 'EXISTS' : 'MISSING');
          
          setIsLoggedIn(true);
          setUser(response.admin.username);
          
          console.log('🔐 Navigating to dashboard...');
          navigate('/admin/dashboard');
          return response;
        }
        
        return { success: false, message: 'Invalid credentials' };
      } catch (error) {
        console.error('❌ API login failed (using fallback):', error);
        
        // Fallback to hardcoded credentials for production/demo
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          console.log('🔐 Using fallback authentication');
          
          // Set dummy token for fallback
          localStorage.setItem('authToken', 'fallback-token-production');
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', credentials.username);
          
          setIsLoggedIn(true);
          setUser(credentials.username);
          navigate('/admin/dashboard');
          return { success: true };
        }
        
        return { success: false, message: 'Invalid username or password. Try admin/admin123 for demo.' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const handleLogout = () => {
    apiUtils.clearAuth();
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  // Show loading during initialization
  if (isInitializing) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{ 
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <Dumbbell size={48} style={{ color: '#9333ea' }} />
            </div>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              Raju Rapse Gym
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Loading application...
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <Routes>
      {/* Public routes - Gym website */}
      <Route path="/" element={<Homepage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/programs" element={<ProgramPage />} />
      <Route path="/trainers" element={<TrainersPage />} />
      <Route path="/contact" element={<ContactUs />} />
      
      {/* Login routes */}
      <Route 
        path="/login" 
        element={
          isLoggedIn ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        } 
      />
      
      {/* Manual admin login route - not visible to users */}
      <Route 
        path="/manual-login" 
        element={
          isLoggedIn ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        } 
      />
      
      {/* Protected admin routes */}
      <Route 
        path="/admin" 
        element={
          isLoggedIn ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      
      <Route 
        path="/admin/dashboard" 
        element={isLoggedIn ? <GymDashboard onLogout={handleLogout} user={user} /> : <Navigate to="/login" replace />} 
      />
      
      <Route 
        path="/admin/register" 
        element={isLoggedIn ? (
          <div>
            <AdminNavigation onLogout={handleLogout} user={user} />
            <MemberRegistration />
          </div>
        ) : <Navigate to="/login" replace />} 
      />
      
      <Route 
        path="/admin/members" 
        element={isLoggedIn ? (
          <div>
            <AdminNavigation onLogout={handleLogout} user={user} />
            <MembersList />
          </div>
        ) : <Navigate to="/login" replace />} 
      />
      
      <Route 
        path="/admin/finance" 
        element={isLoggedIn ? (
          <div>
            <AdminNavigation onLogout={handleLogout} user={user} />
            <IncomeExpenseManager />
          </div>
        ) : <Navigate to="/login" replace />} 
      />
    </Routes>
  );
}

export default App;