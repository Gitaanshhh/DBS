// src/pages/Landing/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

const Landing = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Loading Landing page...');
    document.title = 'BlockBook - Login';
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user) {
          const role = user.user_type || user.role;
          if (role === 'student' || role === 'student-council') {
            navigate('/home');
          } else if (['faculty', 'swo', 'security'].includes(role)) {
            navigate('/approvals');
          } else {
            navigate('/home');
          }
        }
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      console.log(email, password); // Debug: see the email and password being sent
      const response = await fetch('http://localhost:8000/api/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        if (response.status === 401) {
          setError('Invalid email or password (Index.jsx)');
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
        if (role === 'student' || role === 'student-council') {
          navigate('/home');
        } else if (['faculty', 'swo', 'security'].includes(role)) {
          navigate('/approvals');
        } else {
          navigate('/home');
        }
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
