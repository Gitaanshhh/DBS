// src/pages/Landing/index.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Landing.module.css";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);

    if (result.success) {
      // Redirect based on user role
      if (
        result.role === "faculty" ||
        result.role === "swo" ||
        result.role === "security"
      ) {
        navigate("/approval");
      } else if (result.role === "student-council") {
        // Student council can access both approval and regular pages
        navigate("/app/home");
      } else {
        // Regular students
        navigate("/app/home");
      }
    } else {
      setError(result.error || "Login failed");
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
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {error && <div className={styles.error}>{error}</div>}
        </form>
        <div className={styles.registerBox}>
          <span>New to BlockBook?</span>
          <button onClick={() => navigate("/register")}>Register</button>
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
