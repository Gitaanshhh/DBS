// src/components/common/Header/index.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './Header.module.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={styles.header}>
      <Link to={user ? "/app/home" : "/"} className={styles.logo}>BlockBook</Link>
      
      <nav className={`${styles.navLinks} ${menuOpen ? styles.active : ''}`} id="navLinks">
        <Link to="/app/home" className={isActive('/app/home') ? styles.active : ''}>Home</Link>
        <Link to="/app/explore-venues" className={isActive('/app/explore-venues') ? styles.active : ''}>Explore Venues</Link>
        <Link to="/app/community" className={isActive('/app/community') ? styles.active : ''}>Community</Link>
        <Link to="/app/my-bookings" className={isActive('/app/my-bookings') ? styles.active : ''}>My Bookings</Link>
        <Link to="/app/notifications" className={isActive('/app/notifications') ? styles.active : ''}>Notifications</Link>
        
        {/* Show Approval link for student council */}
        {hasRole('student-council') && (
          <Link to="/approval" className={isActive('/approval') ? styles.active : ''}>Approve Requests</Link>
        )}
      </nav>
      
      <div className={styles.userMenu}>
        {user ? (
          <div className={styles.userInfo}>
            <span className={styles.userRole}>{user.role}</span>
            <div 
              className={styles.userIcon} 
              onClick={logout} 
              title="Logout"
            >
              {user.email.substring(0, 2).toUpperCase()}
            </div>
          </div>
        ) : (
          <Link to="/" className={styles.loginBtn}>Login</Link>
        )}
      </div>
      
      <button 
        className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`} 
        id="hamburgerBtn"
        onClick={toggleMenu}
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>
    </header>
  );
};

export default Header;
