// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage or session)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // In a real app, this would be an API call to your Django backend
      // const response = await api.post('/auth/login/', { email, password });
      
      // For demonstration, we'll simulate the response
      let role;
      if (email.endsWith('@manipal.edu')) {
        if (email.includes('faculty') || email.includes('swo') || email.includes('security')) {
          role = 'faculty';
        } else if (email.includes('studentcouncil')) {
          role = 'student-council';
        } else {
          role = 'student';
        }
      } else {
        throw new Error('Invalid email domain');
      }
      
      const userData = { email, role };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, role };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
