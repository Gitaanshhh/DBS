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
        
        console.log('API DEBUG : Landing : ROLE : ', role)
        // console.log('API DEBUG : Landing : DATA : ', data)
        // console.log('API DEBUG : Landing : ROLES : ', user.user_type, user.role)

        if (role === 'student' || role === 'student-council' || role === 'admin') {
          navigate('/home');
        } else if (['faculty', 'swo', 'security'].includes(role)) {
          navigate('/approvals');
        } else {
          navigate('/home');
        }
      } else {
        setError(data.error || 'Login failed. Please check credentials.');
      }

      // Check if email ends with @manipal.edu
      // if (!email.endsWith('@manipal.edu')) {
      //   throw new Error('Only Manipal University emails are allowed');
      // }
      
      // Mock authentication logic - in real app, this would be handled by the backend
      // if (email === 'student@manipal.edu' && password === 'student-password') {
      //   mockResponse = { success: true, user: { email, role: 'student' } };
      // } else if (email === 'sc@manipal.edu' && password === 'sc-password') {
      //   mockResponse = { success: true, user: { email, role: 'student-council' } };
      // } else if (email === 'faculty@manipal.edu' && password === 'faculty-password') {
      //   mockResponse = { success: true, user: { email, role: 'faculty' } };
      // } else if (email === 'swo@manipal.edu' && password === 'swo-password') {
      //   mockResponse = { success: true, user: { email, role: 'swo' } };
      // } else {
      //   // Simulate authentication failure
      //   throw new Error('Invalid email or password');
      // }

      // ACTUAL RESPONSE HANDLING:
      // const data = await response.json();
      // if (!response.ok) {
      //   throw new Error(data.message || 'Login failed');
      // }
      
      
      // Redirect based on user role
      // if (user.role === 'student' || user.role === 'student-council') {
      //   navigate('/app/home');
      // } else if (['faculty', 'swo', 'security'].includes(user.role)) {
      //   navigate('/approval');
      // }

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