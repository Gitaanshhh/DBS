// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Authentication Context for managing user authentication state
 * Provides user information, login/logout functionality, and role-based access control
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkLoggedIn = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, [navigate]);

  /**
   * Handles user login by authenticating with the backend
   * Stores user data in localStorage and updates context state
   * Redirects based on user role after successful login
   */
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (response.ok && data['User Details'] && data['User Details'].length > 0) {
        const dbUser = data['User Details'][0];
        localStorage.setItem('user', JSON.stringify(dbUser));
        localStorage.setItem('token', 'mock-token');
        setUser(dbUser);
        
        // Redirect based on user role
        const role = dbUser.user_type || dbUser.role;
        if (role === 'admin') {
          navigate('/home'); // Admin can access all pages, start at home
        } else if (['faculty', 'swo', 'security'].includes(role)) {
          navigate('/approvals'); // Faculty and other staff go to approval page
        } else if (['student', 'student-council'].includes(role)) {
          navigate('/home'); // Students and student council go to home
        } else {
          navigate('/home'); // Default fallback
        }
        return { success: true, user: dbUser };
      } else {
        throw new Error((data && data.error) || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  /**
   * Handles user logout by clearing stored data and context state
   * Redirects to landing page
   */
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  /**
   * Checks if the current user has the required role(s)
   * @param {string|string[]} roles - Single role or array of roles to check against
   * @returns {boolean} - True if user has the required role
   */
  const hasRole = (roles) => {
    if (!user) return false;
    const userRole = user.user_type || user.role;
    
    // Admin has access to everything
    if (userRole === 'admin') return true;
    
    return Array.isArray(roles)
      ? roles.includes(userRole)
      : userRole === roles;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
