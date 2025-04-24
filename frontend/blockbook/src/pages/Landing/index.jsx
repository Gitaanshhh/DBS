// src/pages/Landing/index.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Landing.module.css';

/**
 * Landing/Login page component
 * Handles user authentication and redirects based on user role
 */
const Landing = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Handles form submission and user authentication
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Invalid email or password');
        } else if (response.status === 404) {
          setError('API endpoint not found. Please check server configuration.');
        } else {
          setError(`Server error: ${response.status}`);
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      if (data['User Details'] && data['User Details'].length > 0) {
        localStorage.setItem('user', JSON.stringify(data['User Details'][0]));
        localStorage.setItem('token', 'mock-token');
        const user = data['User Details'][0];
        const role = user.user_type || user.role;
        
        // Get return URL from location state or use default based on role
        const returnUrl = location.state?.from || 
          (['faculty', 'swo', 'security'].includes(role) ? '/approvals' : '/home');
        
        navigate(returnUrl);
      } else {
        setError(data.error || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
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
        
        {/* Login form */}
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
      </div>
      
      {/* Decorative background elements */}
      <div className={styles.circles}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>
    </div>
  );
};

export default Landing;