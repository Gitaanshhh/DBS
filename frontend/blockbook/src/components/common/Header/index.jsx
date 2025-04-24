// src/components/common/Header/index.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import styles from "./Header.module.css";

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
      <Link to={"/home"} className={styles.logo}>
        BlockBook
      </Link>

      <nav
        className={`${styles.navLinks} ${menuOpen ? styles.active : ""}`}
        id="navLinks"
      >
        {" "}
        {hasRole(["student", "student-council"]) && (
          <>
            <Link to="/home" className={isActive("/home") ? styles.active : ""}>
              Home
            </Link>
            <Link
              to="/explore"
              className={isActive("/explore") ? styles.active : ""}
            >
              Explore Venues
            </Link>
            <Link
              to="/community"
              className={isActive("/community") ? styles.active : ""}
            >
              Community
            </Link>
            <Link
              to="/my-bookings"
              className={isActive("/my-bookings") ? styles.active : ""}
            >
              My Bookings
            </Link>
            <Link
              to="/notifications"
              className={isActive("/notifications") ? styles.active : ""}
            >
              Notifications
            </Link>
          </>
        )}
        {/* Show Approval link for student council and faculty*/}
        {hasRole(['student-council' ,'faculty', 'swo', 'security']) && (
          <Link
            to="/approvals"
            className={isActive("/approvals") ? styles.active : ""}
          >
            Approve Requests
          </Link>
        )}
      </nav>

      <div className={styles.userMenu}>
        {user ? (
          <div className={styles.userInfo}>
            <span className={styles.userRole}>{user.user_type || user.role}</span>
            <div className={styles.userIcon} onClick={logout} title="Logout">
              {user.email && user.email.substring(0, 2).toUpperCase()}
            </div>
          </div>
        ) : (
          location.pathname !== "/" && (
            <Link to="/" className={styles.loginBtn}>
              Login
            </Link>
          )
        )}
      </div>

      <button
        className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`}
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
