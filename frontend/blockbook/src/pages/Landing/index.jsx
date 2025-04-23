// src/pages/Landing/index.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

const Landing = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // ACTUAL API CALL:
      // Make a POST request to your Django backend login endpoint
      // const response = await fetch('http://your-django-api.com/api/auth/login/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password }),
      //   credentials: 'include'  // If using session cookies
      // });
      
      // For testing purposes, we'll simulate the API response
      let mockResponse;
      
      // Check if email ends with @manipal.edu
      if (!email.endsWith('@manipal.edu')) {
        throw new Error('Only Manipal University emails are allowed');
      }
      
      // Mock authentication logic - in real app, this would be handled by the backend
      if (email === 'student@manipal.edu' && password === 'student-password') {
        mockResponse = { success: true, user: { email, role: 'student' } };
      } else if (email === 'sc@manipal.edu' && password === 'sc-password') {
        mockResponse = { success: true, user: { email, role: 'student-council' } };
      } else if (email === 'faculty@manipal.edu' && password === 'faculty-password') {
        mockResponse = { success: true, user: { email, role: 'faculty' } };
      } else if (email === 'swo@manipal.edu' && password === 'swo-password') {
        mockResponse = { success: true, user: { email, role: 'swo' } };
      } else {
        // Simulate authentication failure
        throw new Error('Invalid email or password');
      }

      // ACTUAL RESPONSE HANDLING:
      // const data = await response.json();
      // if (!response.ok) {
      //   throw new Error(data.message || 'Login failed');
      // }
      
      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      localStorage.setItem('token', 'mock-token'); // In real app, this would be the JWT from backend
      
      // Redirect based on user role
      if (mockResponse.user.role === 'student' || mockResponse.user.role === 'student-council') {
        navigate('/app/home');
      } else if (['faculty', 'swo', 'security'].includes(mockResponse.user.role)) {
        navigate('/approval');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.landingBg}>
      <div className={styles.overlay}></div>
      <div className={styles.centerBox}>
        <h1 className={styles.title}>Welcome to BlockBook</h1>
        <p className={styles.subtitle}>MIT Manipal's Venue Booking Platform</p>
        
        <form className={styles.loginBox} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address (@manipal.edu)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          {error && <div className={styles.error}>{error}</div>}
        </form>
        
        {/* Login instructions for testing */}
        <div className={styles.testingInfo}>
          <p>Test Accounts:</p>
          <ul>
            <li>student@manipal.edu / student-password</li>
            <li>sc@manipal.edu / sc-password</li>
            <li>faculty@manipal.edu / faculty-password</li>
            <li>swo@manipal.edu / swo-password</li>
          </ul>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className={styles.circles}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>
    </div>
  );
};

export default Landing;
