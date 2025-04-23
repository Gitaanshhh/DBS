// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading spinner or skeleton while checking authentication
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  // If not logged in, redirect to landing page
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user doesn't have the required role, redirect to home or show unauthorized
  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;
