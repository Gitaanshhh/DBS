// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8000/admin/users', {
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
        if (role === 'student' || role === 'student-council') {
          navigate('/app/home');
        } else if (['faculty', 'swo', 'security'].includes(role)) {
          navigate('/approval');
        } else {
          navigate('/home');
        }
        return { success: true, user: dbUser };
      } else {
        throw new Error((data && data.error) || 'Invalid email or password (AuthContext)');
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const hasRole = (roles) => {
    if (!user) return false;
    const userRole = user.user_type || user.role;
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
