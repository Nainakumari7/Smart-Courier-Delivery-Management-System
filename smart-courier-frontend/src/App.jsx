import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from './styles/theme';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Auth
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import VerifyAccount from './features/auth/VerifyAccount';
import ForgotPassword from './features/auth/ForgotPassword';
import Profile from './features/auth/Profile';
import Settings from './features/auth/Settings';

// Customer
import CustomerDashboard from './features/customer/Dashboard';
import MyDeliveries from './features/customer/MyDeliveries';
import Tracking from './features/customer/Tracking';

// Delivery
import CreateDelivery from './features/delivery/CreateDelivery';

// Admin
import AdminDashboard from './features/admin/Dashboard';
import AdminReports from './features/admin/Reports';
import UserManagement from './features/admin/UserManagement';
import DeliveryManagement from './features/admin/DeliveryManagement';

export const ColorModeContext = React.createContext({ toggleColorMode: () => {}, mode: 'light' });

function App() {
  const [mode, setMode] = React.useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });

  const colorMode = React.useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => {
        const newMode = prevMode === 'light' ? 'dark' : 'light';
        localStorage.setItem('themeMode', newMode);
        return newMode;
      });
    },
    mode,
  }), [mode]);

  const theme = React.useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-account" element={<VerifyAccount />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Tracking — accessible to all authenticated users */}
              <Route path="/customer/track/:id" element={<Tracking />} />

              {/* Profile — any authenticated user */}
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Settings — any authenticated user */}
              <Route path="/settings" element={
                <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_ADMIN']}>
                  <Settings />
                </ProtectedRoute>
              } />

              {/* Protected Customer Routes */}
              <Route path="/customer/dashboard" element={
                <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/customer/deliveries" element={
                <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                  <MyDeliveries />
                </ProtectedRoute>
              } />
              <Route path="/delivery/create" element={
                <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                  <CreateDelivery />
                </ProtectedRoute>
              } />

              {/* Protected Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminReports />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/deliveries" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <DeliveryManagement />
                </ProtectedRoute>
              } />

              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
