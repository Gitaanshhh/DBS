// src/components/common/Footer/index.jsx
import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>
        &copy; {currentYear} BlockBook - College Room and Venue Booking System.
        All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
