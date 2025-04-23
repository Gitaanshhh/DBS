// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in when the app loads
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Get user data from localStorage
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
          // BACKEND INTEGRATION POINT #1:
          // Verify the token with the backend to ensure it's still valid
          // const response = await fetch('http://your-api.com/api/auth/verify-token/', {
          //   method: 'GET',
          //   headers: {
          //     'Authorization': `Bearer ${token}`
          //   }
          // });
          // 
          // if (response.ok) {
          //   const userData = await response.json();
          //   setUser(userData);
          // } else {
          //   // Token invalid, clear storage
          //   localStorage.removeItem('user');
          //   localStorage.removeItem('token');
          //   navigate('/');
          // }

          // For testing, just use the stored user
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        // Ensure loading is set to false even if no user is found
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, [navigate]);

  // Login function
  const login = async (email, password) => {
    try {
      // BACKEND INTEGRATION POINT #2:
      // Send login credentials to backend and get user data and token
      // const response = await fetch('http://your-api.com/api/auth/login/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password }),
      // });
      // 
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Login failed');
      // }
      // 
      // const data = await response.json();
      // localStorage.setItem('token', data.token);
      // localStorage.setItem('user', JSON.stringify(data.user));
      // setUser(data.user);
      // navigate('/home');
      // return data.user;

      // For testing purposes only
      if (!email.endsWith('@manipal.edu')) {
        throw new Error('Only Manipal University emails are allowed');
      }

      let mockUser;
      if (email === 'student@manipal.edu' && password === 'student-password') {
        mockUser = { email, role: 'student' };
      } else if (email === 'sc@manipal.edu' && password === 'sc-password') {
        mockUser = { email, role: 'student-council' };
      } else if (email === 'faculty@manipal.edu' && password === 'faculty-password') {
        mockUser = { email, role: 'faculty' };
      } else if (email === 'swo@manipal.edu' && password === 'swo-password') {
        mockUser = { email, role: 'swo' };
      } else {
        throw new Error('Invalid email or password');
      }

      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-token');
      setUser(mockUser);
      navigate('/home');
      return mockUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // BACKEND INTEGRATION POINT #3:
    // Notify backend about logout to invalidate the token
    // fetch('http://your-api.com/api/auth/logout/', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //   }
    // });

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  // Check if user has a specific role
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
