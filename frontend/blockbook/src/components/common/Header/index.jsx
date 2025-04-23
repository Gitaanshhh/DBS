// src/components/common/Header/index.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={styles.header}>
      <Link to="/app/home" className={styles.logo}>BlockBook</Link>
      <nav className={styles.navLinks}>
        <Link to="/app/home" className={isActive('/app/home') ? styles.active : ''}>Home</Link>
        <Link to="/app/explore-venues" className={isActive('/app/explore-venues') ? styles.active : ''}>Explore Venues</Link>
        <Link to="/app/community" className={isActive('/app/community') ? styles.active : ''}>Community</Link>
        <Link to="/app/my-bookings" className={isActive('/app/my-bookings') ? styles.active : ''}>My Bookings</Link>
        <Link to="/app/notifications" className={isActive('/app/notifications') ? styles.active : ''}>Notifications</Link>
        
        {/* Only show Approval link for student council */}
        {user && user.role === 'student-council' && (
          <Link to="/approval" className={isActive('/approval') ? styles.active : ''}>Approve Requests</Link>
        )}
      </nav>
      <div className={styles.userMenu}>
        <div className={styles.userIcon} onClick={handleLogout} title="Logout">
          {user ? user.email.substring(0, 2).toUpperCase() : 'JD'}
        </div>
      </div>
    </header>
  );
};

export default Header;
