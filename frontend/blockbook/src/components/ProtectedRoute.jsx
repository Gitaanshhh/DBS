// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();
  
  if (loading) {
    // Show loading spinner or skeleton while checking authentication
    return <div className="loading-spinner">Loading...</div>;
  }
  
  // If not logged in, redirect to landing page
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // If roles are specified and user doesn't have the required role
  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    // Redirect to appropriate page based on role
    if (hasRole(['faculty', 'swo', 'security'])) {
      return <Navigate to="/approval" replace />;
    } else {
      return <Navigate to="/app/home" replace />;
    }
  }
  
  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
