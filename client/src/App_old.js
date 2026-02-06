import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import { 
  FitnessCenter, 
  PersonAdd, 
  Dashboard, 
  People, 
  ExitToApp,
  AccountCircle,
  AccountBalance
} from '@mui/icons-material';

import MemberRegistration from './components/MemberRegistration';
import MembersList from './components/MembersList';
import GymDashboard from './components/GymDashboard';
import LoginPage from './components/LoginPage';
import Homepage from './components/Homepage';
import IncomeExpenseManager from './components/IncomeExpenseManager';
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);

  // Manual authentication check only for admin routes
  // const checkAuthState = async () => {
  //   try {
  //     setIsLoading(true);
      
  //     if (!apiUtils.isAuthenticated()) {
  //       setIsLoading(false);
  //       return;
  //     }

  //     // Verify token with backend
  //     const response = await authAPI.verify();
      
  //     if (response.success) {
  //       setIsLoggedIn(true);
  //       setUser(response.admin.username);
  //       setAdminInfo(response.admin);
  //     }
  //   } catch (error) {
  //     console.error('Auth verification failed:', error);
  //     apiUtils.removeToken();
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      
      if (!apiUtils.isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      // Verify token with backend
      const response = await authAPI.verify();
      
      if (response.success) {
        setIsLoggedIn(true);
        setUser(response.admin.username);
        setAdminInfo(response.admin);
      }
    } catch (error) {
      console.warn('Token verification failed:', error.message);
      // Clear invalid auth state
      apiUtils.clearAuth();
      setIsLoggedIn(false);
      setUser(null);
      setAdminInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (username) => {
    setIsLoggedIn(true);
    setUser(username);
    
    // Get updated admin info
    try {
      const storedAdmin = apiUtils.getStoredUser();
      setAdminInfo(storedAdmin);
    } catch (error) {
      console.warn('Failed to get admin info:', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authAPI.logout();
    } catch (error) {
      console.warn('Logout failed:', error.message);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      setAdminInfo(null);
      setActiveTab('dashboard');
      setAnchorEl(null);
      setIsLoading(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
          open={true}
        >
          <Box sx={{ textAlign: 'center' }}>
            <FitnessCenter sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Gym Management System
            </Typography>
            <CircularProgress color="inherit" />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Verifying authentication...
            </Typography>
          </Box>
        </Backdrop>
      </ThemeProvider>
    );
  }

  // Show login page if not authenticated
  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  // Show main app if logged in
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar 
          position="static" 
          elevation={0}
          sx={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
          }}
        >
          <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            <FitnessCenter sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Gym Management System
            </Typography>
            
            <Button 
              color="inherit" 
              component={Link} 
              to="/"
              startIcon={<Dashboard />}
              onClick={() => setActiveTab('dashboard')}
              sx={{ 
                mx: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Dashboard
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/register"
              startIcon={<PersonAdd />}
              onClick={() => setActiveTab('register')}
              sx={{ 
                mx: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Add Member
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/members"
              startIcon={<People />}
              onClick={() => setActiveTab('members')}
              sx={{ 
                mx: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Members
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/finance"
              startIcon={<AccountBalance />}
              onClick={() => setActiveTab('finance')}
              sx={{ 
                mx: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Finance
            </Button>

            {/* User Menu */}
            <Box sx={{ ml: 2 }}>
              <Tooltip title="Admin Account">
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{ ml: 2, color: 'white' }}
                  aria-controls={anchorEl ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={anchorEl ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <AccountCircle />
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <AccountCircle />
                  </Avatar>
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {adminInfo?.username || user}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {adminInfo?.role || 'Admin'}
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 2 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ 
          width: '100%', 
          px: { xs: 2, sm: 3, md: 4 }, 
          py: 3,
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#f5f5f5'
        }}>
          <Routes>
            <Route path="/" element={<GymDashboard />} />
            <Route path="/register" element={<MemberRegistration />} />
            <Route path="/members" element={<MembersList />} />
            <Route path="/finance" element={<IncomeExpenseManager />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;