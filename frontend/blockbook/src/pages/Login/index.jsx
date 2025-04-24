import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // We'll create this file next

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [showRegister, setShowRegister] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  useEffect(() => {
    // Provide visual feedback that the page is loading
    console.log('Loading Login page...');
    document.title = 'BlockBook - Login';
    
    // Check if already logged in
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user) navigate('/');
      } catch (e) {
        // Invalid user JSON in localStorage
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Use relative URL to avoid CORS issues
      const response = await fetch('/api/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      console.log('Login response:', response); // Debug: see the response from the server
      if (!response.ok) {
        // Handle different HTTP error codes
        if (response.status === 401) {
          setError('Invalid email or password (Index.jsx)');
        } else if (response.status === 404) {
          setError('API endpoint not found. Please check server configuration.');
        } else {
          setError(`Server error: ${response.status}`);
        }
        return;
      }
      
      const data = await response.json();
      if (data['User Details'] && data['User Details'].length > 0) {
        localStorage.setItem('user', JSON.stringify(data['User Details'][0]));
        navigate('/');
      } else {
        setError(data.error || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection and try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    try {
      const response = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registerEmail, password: registerPassword })
      });
      const data = await response.json();
      if (response.ok && (data.success || data.message === "Registration successful" || data.user)) {
        setRegisterSuccess('Registration successful! You can now log in.');
        setShowRegister(false);
        setRegisterEmail('');
        setRegisterPassword('');
      } else {
        setRegisterError(data.error || data.message || 'Registration failed');
      }
    } catch (err) {
      setRegisterError('Network error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">BlockBook</h1>
        {!showRegister ? (
          <>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <button type="submit" className="submit-btn">Login</button>
            </form>
            <div className="form-footer">
              <button onClick={() => setShowRegister(true)} className="secondary-btn">
                Create an account
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Register</h2>
            <form onSubmit={handleRegister} style={{ marginTop: '1rem' }}>
              <h3>Register</h3>
              <label>
                Email:
                <input
                  type="text"
                  value={registerEmail}
                  onChange={e => setRegisterEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
              </label>
              <br />
              <label>
                Password:
                <input
                  type="password"
                  value={registerPassword}
                  onChange={e => setRegisterPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </label>
              <br />
              <button type="submit">Register</button>
              {registerError && <div style={{ color: 'red' }}>{registerError}</div>}
              {registerSuccess && <div style={{ color: 'green' }}>{registerSuccess}</div>}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;