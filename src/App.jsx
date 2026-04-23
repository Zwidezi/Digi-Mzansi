import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/shared/Layout';
import Home from './pages/Home';
import Registration from './pages/Registration';
import Inventory from './pages/Inventory';
import Payments from './pages/Payments';
import Marketplace from './pages/Marketplace';
import Compliance from './pages/Compliance';
import Finance from './pages/Finance';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null; // Or a loading spinner
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <Layout>{children}</Layout>;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="/market" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
          <Route path="/registration" element={<ProtectedRoute><Registration /></ProtectedRoute>} />
          <Route path="/compliance" element={<ProtectedRoute><Compliance /></ProtectedRoute>} />
          <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
          
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
