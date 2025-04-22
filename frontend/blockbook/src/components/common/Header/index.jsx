import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>BlockBook</Link>
      <nav className={`${styles.navLinks} ${menuOpen ? styles.active : ''}`} id="navLinks">
        <Link to="/" className={isActive('/') ? styles.active : ''}>Home</Link>
        <Link to="/explore-venues" className={isActive('/explore-venues') ? styles.active : ''}>Explore Venues</Link>
        <Link to="/community" className={isActive('/community') ? styles.active : ''}>Community</Link>
        <Link to="/my-bookings" className={isActive('/my-bookings') ? styles.active : ''}>My Bookings</Link>
        <Link to="/inbox" className={isActive('/inbox') ? styles.active : ''}>Inbox</Link>
        <Link 
          to="/notifications" 
          className={`${isActive('/notifications') ? styles.active : ''} ${styles.notificationIndicator}`}
        >
          Notifications
        </Link>
      </nav>
      <div className={styles.userMenu}>
        <div className={styles.userIcon}>JD</div>
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
