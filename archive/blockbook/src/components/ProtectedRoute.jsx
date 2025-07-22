// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component that handles route protection based on user roles
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  // Redirect to landing page if not logged in, preserving the return URL
  if (!user) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // Check role access and redirect to home if unauthorized
  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to="/home" replace />;
  }

  // Render protected content if all checks pass
  return children;
};

export default ProtectedRoute;
